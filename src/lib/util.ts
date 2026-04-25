import { error } from '@sveltejs/kit';
import type { ResponseCheck } from './server/Response';

const checkForErrors = (res: ResponseCheck) => {
	if (res.status !== 200 && typeof res.message === 'string') {
		error(res.status, { message: res.message });
	}
};

const formatDate = (val: Date | string, format?: 'date' | 'month' | 'year') => {
	const date = new Date(val);
	return format === 'year'
		? `${date.getFullYear()}`
		: format === 'month'
			? `${date.getFullYear()} - ${date.getMonth() + 1}`
			: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const parseZErrors = (errors: {
	errors: string[];
	properties?: { [key: string]: { errors: string[] } | undefined };
}) => {
	const _errors = [...errors.errors];

	if (errors.properties) {
		Object.entries(errors.properties).forEach((kv) => {
			const val = kv[1];
			if (val) val.errors.forEach((e) => _errors.push(e));
		});
	}
	return _errors;
};

const createNotification = (text: string, type: 'success' | 'warning' | 'danger') => {
	return { title: type.toUpperCase(), description: text, type };
};

const calculateAge = (birth: Date | string) => {
	const today = new Date();
	if (typeof birth === 'string') {
		birth = new Date(birth);
	}

	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();

	// Check if the birthday has occurred yet this year
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age--;
	}

	return age;
};

export { calculateAge, checkForErrors, createNotification, formatDate, parseZErrors };
