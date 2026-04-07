import { env } from '$env/dynamic/private';
import { ActivityLevelController } from './controllers/ActivityLevelController';
import { FoodController } from './controllers/FoodController';
import { MealController } from './controllers/MealController';
import { NutrientController } from './controllers/NutrientController';
import { PhysicalTypeController } from './controllers/PhysicalTypeController';
import { RecommendationsController } from './controllers/RecommendationController';
import { RoleController } from './controllers/RoleController';
import { UserController } from './controllers/UserController';
import {
	activityLevel,
	food,
	meal,
	nutrient,
	recommendation,
	profile,
	physicalType,
	role
} from './db/schema';
import { UsdaAPIController } from './usda';

// define controllers
const activityLevelController: ActivityLevelController = new ActivityLevelController(
	'ActivityLevel',
	activityLevel
);
const nutrientController: NutrientController = new NutrientController('Nutrient', nutrient);
const ingredientController: FoodController = new FoodController('Ingredient', food);
const mealController: MealController = new MealController('Meal', meal);
const userController: UserController = new UserController('Profile', profile);
const recommendationController: RecommendationsController = new RecommendationsController(
	'Recommendation',
	recommendation
);
const roleController: RoleController = new RoleController('Role', role);
const physicalTypeController: PhysicalTypeController = new PhysicalTypeController(
	'PhysicalType',
	physicalType
);
const usdaApi = new UsdaAPIController(env.usda_api_key);

export {
	activityLevelController,
	ingredientController,
	mealController,
	nutrientController,
	physicalTypeController,
	recommendationController,
	roleController,
	usdaApi,
	userController
};
