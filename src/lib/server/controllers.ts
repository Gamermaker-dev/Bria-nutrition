import { config } from 'dotenv';
import { ActivityLevelController } from './controllers/ActivityLevelController';
import { FoodController } from './controllers/FoodController';
import { MealController } from './controllers/MealController';
import { NutrientController } from './controllers/NutrientController';
import { PhysicalTypeController } from './controllers/PhysicalTypeController';
import { RecommendationController } from './controllers/RecommendationController';
import { RoleController } from './controllers/RoleController';
import { UserController } from './controllers/UserController';
import { UsdaAPIController } from './usda';
config({ path: '.env' });

// define controllers
const activityLevelController: ActivityLevelController = new ActivityLevelController(
	'ActivityLevel'
);
const nutrientController: NutrientController = new NutrientController('Nutrient');
const foodController: FoodController = new FoodController('Food');
const mealController: MealController = new MealController('Meal');
const userController: UserController = new UserController('Profile');
const recommendationController: RecommendationController = new RecommendationController(
	'Recommendation'
);
const roleController: RoleController = new RoleController('Role');
const physicalTypeController: PhysicalTypeController = new PhysicalTypeController('PhysicalType');
const usdaApi = new UsdaAPIController(process.env.usda_api_key ?? '');

export {
	activityLevelController,
	foodController,
	mealController,
	nutrientController,
	physicalTypeController,
	recommendationController,
	roleController,
	usdaApi,
	userController
};
