import type { ProfileInput } from '$lib/server/db/user/profile.schema';

export const validate = (
	formData: FormData,
	userId: string
): { input: ProfileInput; errors: string[] } => {
	const errors: string[] = [];
	const newProfile: ProfileInput = {
		userId,
		firstName: '',
		lastName: '',
		age: 0,
		sex: '',
		heightInch: 0,
		heightFeet: 0,
		weight: ''
	};

	let age: number = 0;
	let sex: string = '';
	let heightInch: number = 0;
	let heightFeet: number = 0;
	let weight: number = 0;

	const firstName = formData.get('firstName')?.toString();
	if (!firstName || firstName.trim().length === 0) {
		errors.push('First name is required');
	}

	const lastName = formData.get('lastName')?.toString();
	if (!lastName || lastName.trim().length === 0) {
		errors.push('Last name is required');
	}

	const formAge = formData.get('age')?.toString();
	if (!formAge || formAge.trim().length === 0) {
		errors.push('Age is required');
	} else {
		age = parseInt(formAge, 10);
		if (isNaN(age)) {
			errors.push('Age must be a number');
		}
	}

	const formSex = formData.get('sex')?.toString();
	if (!formSex || formSex.trim().length === 0) {
		errors.push('Sex is required');
	}

	const formHeightInch = formData.get('heightInch')?.toString();
	if (!formHeightInch || formHeightInch.trim().length === 0) {
		errors.push('Height is required');
	} else {
		heightInch = parseInt(formHeightInch, 10);
		if (isNaN(heightInch)) {
			errors.push('Height must be a number');
		}
	}

	const formHeightFeet = formData.get('heightFeet')?.toString();
	if (!formHeightFeet || formHeightFeet.trim().length === 0) {
		errors.push('Height is required');
	} else {
		heightFeet = parseInt(formHeightFeet, 10);
		if (isNaN(heightFeet)) {
			errors.push('Height must be a number');
		}
	}

	const formWeight = formData.get('weight')?.toString();
	if (!formWeight || formWeight.trim().length === 0) {
		errors.push('Weight is required');
	} else {
		weight = parseFloat(formWeight);
		if (isNaN(weight)) {
			errors.push('Weight must be a number');
		}
	}

	if (errors.length === 0) {
		newProfile.firstName = firstName as string;
		newProfile.lastName = lastName as string;
		newProfile.age = age;
		newProfile.sex = formSex as string;
		newProfile.heightInch = heightInch;
		newProfile.heightFeet = heightFeet;
		newProfile.weight = weight.toFixed(1).toString();
		newProfile.dateAdded = new Date();
	}

	return { input: newProfile, errors };
};
