import type { FoodListItem } from '$lib/types/usda/FoodListItem';
import type { FoodPaginatedSearch } from '$lib/types/usda/FoodPaginatedSearch';

export class UsdaAPIController {
	private _apiKey: string;

	constructor(apiKey: string) {
		this._apiKey = apiKey;
	}

	searchFoods = async (search: string, page: number) => {
		try {
			const url = encodeURI(
				`https://api.nal.usda.gov/fdc/v1/foods/search?query=${search}?&pageSize=50&pageNumber=${page}&api_key=${this._apiKey}`
			);
			return await fetch(url, {
				method: 'GET',
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
				.then(async (res) => {
					if (res.status === 200) return (await res.json()) as FoodPaginatedSearch;
					else throw Error((await res.json()).message);
				})
				.catch((err) => {
					console.log(
						`Error occurred processing request for API getFoodList using url ${url}: ${err}`
					);
					throw Error(
						`Error occurred processing request for API getFoodList using url ${url}: ${err}`
					);
				});
		} catch (err) {
			console.log(`Error occurred running API getFoodList: ${err}`);
		}
	};

	getFoodList = async (
		dataType: ('Branded' | 'Foundation' | 'Survey (FNDDS)' | 'SR Legacy')[],
		page: number
	) => {
		try {
			const url = encodeURI(
				`https://api.nal.usda.gov/fdc/v1/foods/list?dataType=${dataType.join()}&pageSize=25&pageNumber=${page}&api_key=${this._apiKey}`
			);
			return await fetch(url, {
				method: 'GET',
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
				.then(async (res) => {
					if (res.status === 200) return (await res.json()) as FoodListItem[];
					else throw Error((await res.json()).message);
				})
				.catch((err) => {
					console.log(
						`Error occurred processing request for API getFoodList using url ${url}: ${err}`
					);
					throw Error(
						`Error occurred processing request for API getFoodList using url ${url}: ${err}`
					);
				});
		} catch (err) {
			console.log(`Error occurred running API getFoodList: ${err}`);
		}
	};
}
