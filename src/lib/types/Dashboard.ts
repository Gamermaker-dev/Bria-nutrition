export type Dashboard = {
	userId: string;
	mealDate: string | Date;
	age: number;
	sex: 'M' | 'F';
	height: number;
	weight: number;
	activityLevelMultiplier: number;
	calories: number;
	carbs: number;
	protein: number;
	fat: number;
};
