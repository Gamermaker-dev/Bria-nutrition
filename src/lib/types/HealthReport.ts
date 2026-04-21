export type HealthReport = {
    userId: string;
    mealDate: Date | string;
    nutrientName: string;
    amount: string | null;
}[];