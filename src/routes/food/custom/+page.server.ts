import { env } from '$env/dynamic/private';
import { foodController } from '$lib/server/controllers';
import type { FoodInput } from '$lib/server/db/schema';
import { createNotification } from '$lib/util';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fail } from '@sveltejs/kit';
import { createWorker, PSM } from 'tesseract.js';
import type { Actions } from './$types';

const genAI = new GoogleGenerativeAI(env.GOOGLE_GEMINI);

export const actions: Actions = {
	scan: async (event) => {
		const formData = await event.request.formData();
		const image = formData.get('label') as File;

		// 1. Validation
		if (!image || image.size === 0) {
			return fail(400, { errors: ['No image uploaded'] });
		}

		// 2. Convert File to Buffer
		const arrayBuffer = await image.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		try {
			// 3. Initialize Tesseract Worker
			const worker = await createWorker('eng');

			await worker.setParameters({
				tessedit_pageseg_mode: PSM.SINGLE_BLOCK
			});

			// 4. Perform OCR
			const {
				data: { text }
			} = await worker.recognize(buffer);
			await worker.terminate();

			// 5. Parse Data (Basic Regex Example)
			const nutritionData = {
				calories: text.match(/Calories\s+(\d+)/i)?.[1] || 'Not found',
				fat: text.match(/Total\s+Fat\s+([\d.]+g)/i)?.[1] || 'Not found',
				carbs: text.match(/Total\s+Carbohydrates?\s+([\d.]+g)/i)?.[1] || 'Not found',
				protein: text.match(/Protein\s+([\d.]+g)/i)?.[1] || 'Not found',
				rawText: text // Useful for debugging
			};

			return {
				status: 202,
				notification: createNotification('Successfully parsed label!', 'success'),
				nutritionData
			};
		} catch (err) {
			console.error('OCR Error:', err);
			return fail(500, { notification: createNotification('Failed to process image', 'danger') });
		}
	},
	gemini: async (event) => {
		const data = await event.request.formData();
		const image = data.get('label') as File;

		if (!image) return fail(400, { errors: ['No image uploaded'] });

		// Convert File to bytes
		const imageBytes = new Uint8Array(await image.arrayBuffer());

		try {
			const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }, { apiVersion: 'v1' });

			const prompt =
				'Analyze this image and provide the nutrition facts in JSON format { calories: number | null, fat: number | null, protein: number | null, carbs: number | null }.';

			const result = await model.generateContent([
				prompt,
				{ inlineData: { data: Buffer.from(imageBytes).toString('base64'), mimeType: image.type } }
			]);

			let nutritionData = {
				calories: 'Not found',
				carbs: 'Not found',
				protein: 'Not found',
				fat: 'Not found'
			};

			try {
				const rawResults = result.response
					.text()
					.replace(/```json/g, '')
					.replace(/```/, '');
				const nutritionRes = JSON.parse(rawResults) as {
					calories: number | null;
					carbs: number | null;
					protein: number | null;
					fat: number | null;
				};
				nutritionData = {
					calories: `${nutritionRes.calories ?? 'Not found'}`,
					carbs: `${nutritionRes.carbs ?? 'Not found'}`,
					protein: `${nutritionRes.protein ?? 'Not found'}`,
					fat: `${nutritionRes.fat ?? 'Not found'}`
				};
			} catch (err) {
				console.error('Error parsing response from Gemini:', err);
				console.error('Actual response was:', result.response.text());
				nutritionData = {
					calories: 'Not found',
					carbs: 'Not found',
					protein: 'Not found',
					fat: 'Not found'
				};
			}
			return {
				status: 202,
				notification: createNotification('Successfully read label using Gemini!', 'success'),
				nutritionData
			};
		} catch (err) {
			console.error('Error with Google Gemini:', err);
			return fail(400, {
				notification: createNotification(
					'Google Gemini is not available. Please try again later.',
					'danger'
				)
			});
		}
	},
	add: async (event) => {
		try {
			const formData = await event.request.formData();

			const rawNutritionInput = formData.get('nutritionInput')?.toString();
			if (rawNutritionInput) {
				const nInput = JSON.parse(rawNutritionInput) as {
					name: string;
					calories: number;
					carbs: number;
					protein: number;
					fat: number;
					mealDate: string;
					serving: number;
				};
				const foodInput: FoodInput = {
					userId: event.locals.user?.id ?? '',
					mealDate: nInput.mealDate,
					fdcId: 0, // not really needed
					name: nInput.name,
					serving: nInput.serving,
					nutrients: [
						{ nutrientId: 10, amount: nInput.calories },
						{ nutrientId: 7, amount: nInput.carbs },
						{ nutrientId: 5, amount: nInput.protein },
						{ nutrientId: 6, amount: nInput.fat }
					]
				};

				const res = await foodController.create(foodInput);

				if (res.status !== 200)
					return fail(400, {
						notification: createNotification(
							'Whoops! Something unexpected happened adding your custom food!',
							'danger'
						)
					});

				return {
					status: 200,
					notification: createNotification('Successfully created food!', 'success')
				};
			}
		} catch (err) {
			console.error('Error adding food:', err);
			return fail(500, { notification: createNotification('Failed to add food!', 'danger') });
		}
	}
};
