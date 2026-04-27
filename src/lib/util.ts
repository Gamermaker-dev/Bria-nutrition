import { error } from '@sveltejs/kit';
import type { ResponseCheck } from './server/Response';
import dayjs from 'dayjs';

const checkForErrors = (res: ResponseCheck) => {
	if (res.status !== 200 && typeof res.message === 'string') {
		error(res.status, { message: res.message });
	}
};

const formatDate = (val: Date | string, format?: 'date' | 'month' | 'year') => {
	const f = format === 'date' ? 'YYYY-MM-DD' : format === 'month' ? 'YYYY-MM' : 'YYYY'
	return dayjs(val).format(f);
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
	const today = dayjs();

	return today.diff(dayjs(birth), 'year');
};

export {
	calculateAge,
	checkForErrors,
	createNotification,
	formatDate,
	parseZErrors
};
