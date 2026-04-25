import { userController } from '$lib/server/controllers';
import { checkForErrors } from '$lib/util';
import { error } from '@sveltejs/kit';
import { isDate } from 'util/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const userId = event.locals.user.id;

		if (userId == undefined) throw error(400, { message: 'Bad request!' });

		const params = Object.fromEntries(event.url.searchParams) as {
			startDate?: string;
			endDate?: string;
			groupBy?: string;
		};

		const TODAY = new Date();
		const SEVEN_DAYS_AGO = new Date();
		SEVEN_DAYS_AGO.setDate(SEVEN_DAYS_AGO.getDate() - 7);

		const startDate =
			params.startDate != undefined
				? new Date(params.startDate)
				: SEVEN_DAYS_AGO;
		const endDate =
			params.endDate != undefined
				? new Date(params.endDate)
				: TODAY;
		const groupBy =
			params.groupBy != undefined && ['year', 'month', 'date'].includes(params.groupBy)
				? params.groupBy
				: 'date';

		if (!isDate(startDate) || !isDate(endDate)) throw error(400, { message: 'Bad request' });

		const report = await userController.getHealthReport(userId, startDate, endDate);
		checkForErrors(report);

		return { startDate, endDate, groupBy, report: report.data };
	} catch (err) {
		console.error('Error loading health report:', err);
		return error(500);
	}
};
