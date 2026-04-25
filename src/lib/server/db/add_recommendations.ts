import { parse } from 'csv-parse/sync';
import { readFile } from 'node:fs/promises';
import { exit } from 'node:process';
import { prisma } from './prisma';
import { type RecommendationManyInput } from './schema';

type importData = {
	Age: string;
	Male: string;
	Female: string;
	Pregancy?: string;
	Lactation?: string;
};

const parseData = async (labelId: number, records: importData[]) => {
	const inputs: RecommendationManyInput[] = records.reduce((curr, val) => {
		let minAge: number = 0;
		let maxAge: number = 0;

		console.log(`${Object.keys(val)}`);
		const conversion = val.Age.includes('years') ? 12 : 1;
		const ageString = val.Age.replaceAll(/\D/g, ' ').trim().replaceAll(/\s+/g, ' ').split(' ');

		if (ageString.length === 1) {
			if (ageString[0].length > 1) {
				minAge = parseInt(ageString[0], 10) * conversion;
			} else {
				maxAge = parseInt(ageString[0], 10) * conversion;
			}
		} else if (ageString.length === 2) {
			minAge = parseInt(ageString[0], 10) * conversion;
			maxAge = parseInt(ageString[1], 10) * conversion;
		}

		const maleInput: RecommendationManyInput = {
			labelId,
			minAge,
			maxAge: maxAge !== 0 ? maxAge : undefined,
			physicalTypeId: 1,
			amount: parseFloat(val.Male.replaceAll(/\D/g, '').trim()) / 1000.0
		};

		curr.push(maleInput);

		const femaleInput: RecommendationManyInput = {
			labelId,
			minAge,
			maxAge: maxAge !== 0 ? maxAge : undefined,
			physicalTypeId: 2,
			amount: parseFloat(val.Female.replaceAll(/\D/g, '').trim()) / 1000.0
		};

		curr.push(femaleInput);

		if (val.Pregancy && val.Pregancy !== '') {
			const pregancyInput: RecommendationManyInput = {
				labelId,
				minAge,
				maxAge: maxAge !== 0 ? maxAge : undefined,
				physicalTypeId: 3,
				amount: parseFloat(val.Pregancy.replaceAll(/\D/g, '').trim()) / 1000.0
			};

			curr.push(pregancyInput);
		}

		if (val.Lactation && val.Lactation !== '') {
			const lactationInput: RecommendationManyInput = {
				labelId,
				minAge,
				maxAge: maxAge !== 0 ? maxAge : undefined,
				physicalTypeId: 4,
				amount: parseFloat(val.Lactation.replaceAll(/\D/g, '').trim()) / 1000.0
			};

			curr.push(lactationInput);
		}

		return curr;
	}, [] as RecommendationManyInput[]);

	return inputs;
};

const main = async () => {
	const fileContent = await readFile(
		`./src/lib/server/db/files/recommendations/${process.argv[3]}.csv`,
		'utf-8'
	);

	console.log(fileContent);

	const records = parse(fileContent, {
		columns: true,
		skip_empty_lines: true,
		skip_records_with_error: true
	}) as unknown as importData[];

	const labelResults = await prisma.label
		.findMany({
			where: { name: process.argv[3].replaceAll(/_/g, ' ') }
		})
		.then((res) => res.map((r) => ({ ...r, id: Number(r.id) })));
	const labelId = labelResults[0].id;

	const inputs = await parseData(labelId, records);

	await prisma.recommendation.createMany({
		data: inputs
	});
};

main()
	.then(() => exit())
	.catch((err) => {
		console.error(err);
		exit(1);
	});
