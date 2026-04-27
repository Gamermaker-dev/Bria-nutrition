import { userController } from '$lib/server/controllers';
import { checkForErrors } from '$lib/util';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { isDate } from 'util/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		if (!event.locals.dbLive) {
			throw error(503, {
				message:
					'Unable to load Bria Nutrition. We apologize for the error. Please try again later.'
			});
		}

		const userId = event.locals.user.id;

		if (userId == undefined) throw error(400, { message: 'Bad request!' });

		const params = Object.fromEntries(event.url.searchParams) as {
			startDate?: string;
			endDate?: string;
			groupBy?: string;
		};

		let startDate =
			params.startDate != undefined
				? dayjs.utc(params.startDate).toDate()
				: dayjs.utc().subtract(7, 'days').toDate();
		let endDate =
			params.endDate != undefined ? dayjs.utc(params.endDate).toDate() : dayjs.utc().toDate();
		const groupBy =
			params.groupBy != undefined && ['year', 'month', 'date'].includes(params.groupBy)
				? params.groupBy
				: 'date';

		if (!isDate(startDate)) startDate = dayjs.utc().toDate();
		if (!isDate(endDate)) endDate = dayjs.utc().toDate();

		const report = await userController.getHealthReport(userId, startDate, endDate);
		checkForErrors(report);

		console.log(report.data);

		return { startDate, endDate, groupBy, report: report.data };
	} catch (err) {
		console.error('Error loading health report:', err);
		if (err?.status === 503) throw err;
		throw error(503, { message: 'Unable to load page. Please try again later.' });
	}
};
