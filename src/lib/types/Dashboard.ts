export type Dashboard = {
	nutrients: {
		id: number;
		name: string;
		tdee: number | null;
		recommended: number;
		actual: number;
	}[];
};
