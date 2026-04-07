import { error } from '@sveltejs/kit';
import type { ResponseCheck } from './server/Response';

const checkForErrors = (res: ResponseCheck) => {
	if (res.status !== 200 && typeof res.message === 'string') {
		error(res.status, { message: res.message });
	}
};

const formatDate = (val: Date | string) => {
	const date = new Date(val);
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export { checkForErrors, formatDate };
