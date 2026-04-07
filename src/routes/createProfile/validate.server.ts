import type { ProfileInput } from '$lib/server/db/user/profile.schema';

export const validate = (
	formData: FormData,
	userId: string
): { input: ProfileInput; errors: string[] } => {
	const errors: string[] = [];
	const newProfile: ProfileInput = {
		userId,
		birthDate: new Date(1900, 0, 1),
		physicalTypeId: 0,
		heightInch: 0,
		heightFeet: 0,
		weight: '',
		activityLevelId: 0
	};

	let birthDate: Date = new Date(1900, 0, 1);
	let physicalType: number = 0;
	let heightInch: number = 0;
	let heightFeet: number = 0;
	let weight: number = 0;
	let activityLevel: number = 0;

	const formBirthDate = formData.get('birthDate')?.toString();
	if (!formBirthDate || formBirthDate.trim().length === 0) {
		errors.push('Birth date is required');
	} else {
		birthDate = new Date(formBirthDate);
	}

	const formPhysicalType = formData.get('physicalType')?.toString();
	if (!formPhysicalType || formPhysicalType.trim().length === 0) {
		errors.push('Physical Type is required.');
	} else {
		physicalType = parseInt(formPhysicalType, 10);
		if (isNaN(physicalType)) {
			errors.push('Physical Type must be a number');
		}
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

	const formActivityLevel = formData.get('activityLevel')?.toString();
	if (!formActivityLevel || formActivityLevel.trim().length === 0) {
		errors.push('Activity Level is required.');
	} else {
		activityLevel = parseInt(formActivityLevel, 10);
		if (isNaN(activityLevel)) {
			errors.push('Activity Level must be a number');
		}
	}

	if (errors.length === 0) {
		newProfile.birthDate = birthDate;
		newProfile.physicalTypeId = physicalType;
		newProfile.heightInch = heightInch;
		newProfile.heightFeet = heightFeet;
		newProfile.weight = weight.toFixed(1).toString();
		newProfile.activityLevelId = activityLevel;
		newProfile.dateAdded = new Date();
	}

	return { input: newProfile, errors };
};
