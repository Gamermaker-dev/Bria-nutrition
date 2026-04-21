import type { FoodListItem } from './FoodListItem';

export type FoodPaginatedSearch = {
	aggregations?: {
		dataType: {
			Branded?: number;
			'SR Legacy'?: number;
			'Survey (FNDDS)'?: number;
			Foundation?: number;
		};
		nutrients: object;
	};
	currentPage: number;
	pageList: number[];
	totalHits: number;
	totalPages: number;
	foods: FoodListItem[];
};
