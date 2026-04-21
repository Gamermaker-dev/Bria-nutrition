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
			? `${date.getFullYear()} - ${date.getMonth()}`
			: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const createActionError = (props: { [key: string]: string[] }) => {
	const error = {
		errors: {
			errors: Object.values(props).flat(),
			properties: {}
		} as { errors: string[]; properties: { [key: string]: { errors: string[] } } }
	};
	Object.entries(props).forEach((p) => {
		error.errors.properties[`${p[0]}`] = { errors: p[1] };
	});
	console.log(error);
	return error;
};

export { checkForErrors, formatDate, createActionError };
