import type { FoodNutrient } from "./FoodNutrient";

export type FoodListItem = {
    fdcId: number;
    description: string;
    dataType: string;
    publicationDate: Date;
    ndbNumber?: string;
    foodNutrients: FoodNutrient[];
    scientificName?: string;
    brandOwner?: string;
    gtinUpc?: string;
    ingredients?: string;
    additionalDescription?: string;
    allHighLightFields?: string;
    score?: number;
}