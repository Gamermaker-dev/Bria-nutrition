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

		const startDate =
			params.startDate != undefined
				? new Date(params.startDate)
				: new Date(TODAY.getFullYear() - 1, TODAY.getMonth(), TODAY.getDate());
		const endDate =
			params.endDate != undefined
				? new Date(params.endDate)
				: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
		const groupBy =
			params.groupBy != undefined && ['year', 'month', 'date'].includes(params.groupBy)
				? params.groupBy
				: 'year';

		if (!isDate(startDate) || !isDate(endDate)) throw error(400, { message: 'Bad request' });

		const report = await userController.getHealthReport(userId, startDate, endDate);
		checkForErrors(report);

		return { startDate, endDate, groupBy, report: report.data };
	} catch (err) {
		console.error('Error loading health report:', err);
		return error(500);
	}
};
