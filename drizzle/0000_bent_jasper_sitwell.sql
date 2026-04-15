CREATE OR REPLACE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `activity_level` (
	`id` serial,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`multiplier` decimal(4,3),
	`date_added` datetime NOT NULL,
	CONSTRAINT `activity_level_id` PRIMARY KEY(`id`),
	CONSTRAINT `activity_level_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `profile` (
	`id` serial,
	`user_id` varchar(36) NOT NULL,
	`birth_date` datetime NOT NULL,
	`physical_type_id` bigint unsigned NOT NULL,
	`height_inch` int NOT NULL,
	`height_feet` int NOT NULL,
	`weight` decimal(4,1) NOT NULL,
	`activityLevelId` bigint unsigned NOT NULL,
	`age` int GENERATED ALWAYS AS (TIMESTAMPDIFF(YEAR, `profile`.`birth_date`, CURDATE())) VIRTUAL,
	`next_profile_id` bigint unsigned,
	`date_added` datetime NOT NULL,
	`date_updated` datetime,
	`date_deleted` datetime,
	CONSTRAINT `profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `nutrient` (
	`id` serial,
	`name` text NOT NULL,
	`unit` text NOT NULL,
	`fdc_number` int NOT NULL,
	`date_added` datetime NOT NULL,
	CONSTRAINT `nutrient_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `food` (
	`id` serial,
	`name` text NOT NULL,
	`fdcId` int,
	`user_id` varchar(36),
	`date_added` datetime NOT NULL,
	CONSTRAINT `food_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `food_nutrient` (
	`food_id` bigint unsigned NOT NULL,
	`nutrient_id` bigint unsigned NOT NULL,
	`amount` float NOT NULL,
	CONSTRAINT `food_nutrient_primary_key` PRIMARY KEY(`food_id`,`nutrient_id`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `meal` (
	`id` serial,
	`meal_date` date NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`date_added` datetime NOT NULL,
	`date_updated` datetime,
	`date_deleted` datetime,
	CONSTRAINT `meal_id` PRIMARY KEY(`id`),
	CONSTRAINT `userMeal_indx` UNIQUE(`meal_date`,`user_id`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `meal_food` (
	`meal_id` bigint unsigned NOT NULL,
	`food_id` bigint unsigned NOT NULL,
	`amount` float NOT NULL,
	CONSTRAINT `meal_food_primary_key` PRIMARY KEY(`meal_id`,`food_id`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `role` (
	`int` serial,
	`name` text NOT NULL,
	`date_added` datetime NOT NULL,
	CONSTRAINT `role_int` PRIMARY KEY(`int`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `user_role` (
	`userId` varchar(36) NOT NULL,
	`role_id` bigint unsigned NOT NULL,
	`date_added` datetime NOT NULL,
	CONSTRAINT `user_role_primary_key` PRIMARY KEY(`userId`,`role_id`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `recommendation` (
	`id` serial,
	`nutrient_id` bigint unsigned NOT NULL,
	`min_age` int NOT NULL,
	`max_age` int,
	`physical_type_id` bigint unsigned NOT NULL,
	`amount` float NOT NULL,
	CONSTRAINT `recommendation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `label` (
	`id` serial,
	`name` text NOT NULL,
	`date_added` datetime NOT NULL,
	CONSTRAINT `label_id` PRIMARY KEY(`id`),
	CONSTRAINT `label_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `profile_label` (
	`profile_id` bigint unsigned NOT NULL,
	`label_id` bigint unsigned NOT NULL
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `label_nutrient` (
	`label_id` bigint unsigned NOT NULL,
	`nutrient_id` bigint unsigned NOT NULL
);
--> statement-breakpoint
CREATE OR REPLACE TABLE `physical_type` (
	`id` serial,
	`name` text NOT NULL,
	`date_added` datetime NOT NULL,
	CONSTRAINT `physical_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile` ADD CONSTRAINT `profile_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile` ADD CONSTRAINT `profile_physical_type_id_physical_type_id_fk` FOREIGN KEY (`physical_type_id`) REFERENCES `physical_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile` ADD CONSTRAINT `profile_activityLevelId_activity_level_id_fk` FOREIGN KEY (`activityLevelId`) REFERENCES `activity_level`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile` ADD CONSTRAINT `next_profile_foreignKey` FOREIGN KEY (`next_profile_id`) REFERENCES `profile`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `food_nutrient` ADD CONSTRAINT `food_nutrient_food_id_food_id_fk` FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `food_nutrient` ADD CONSTRAINT `food_nutrient_nutrient_id_nutrient_id_fk` FOREIGN KEY (`nutrient_id`) REFERENCES `nutrient`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meal` ADD CONSTRAINT `meal_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meal_food` ADD CONSTRAINT `meal_food_meal_id_meal_id_fk` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meal_food` ADD CONSTRAINT `meal_food_food_id_food_id_fk` FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_role_id_role_int_fk` FOREIGN KEY (`role_id`) REFERENCES `role`(`int`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recommendation` ADD CONSTRAINT `recommendation_nutrient_id_nutrient_id_fk` FOREIGN KEY (`nutrient_id`) REFERENCES `nutrient`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recommendation` ADD CONSTRAINT `recommendation_physical_type_id_physical_type_id_fk` FOREIGN KEY (`physical_type_id`) REFERENCES `physical_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile_label` ADD CONSTRAINT `profile_label_profile_id_profile_id_fk` FOREIGN KEY (`profile_id`) REFERENCES `profile`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile_label` ADD CONSTRAINT `profile_label_label_id_label_id_fk` FOREIGN KEY (`label_id`) REFERENCES `label`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `label_nutrient` ADD CONSTRAINT `label_nutrient_label_id_label_id_fk` FOREIGN KEY (`label_id`) REFERENCES `label`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `label_nutrient` ADD CONSTRAINT `label_nutrient_nutrient_id_nutrient_id_fk` FOREIGN KEY (`nutrient_id`) REFERENCES `nutrient`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE OR REPLACE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE OR REPLACE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE OR REPLACE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE OR REPLACE INDEX `userId_indx` ON `profile` (`user_id`);--> statement-breakpoint
CREATE OR REPLACE INDEX `userId_indx` ON `food` (`user_id`);--> statement-breakpoint
CREATE OR REPLACE INDEX `foodId_indx` ON `food_nutrient` (`food_id`);--> statement-breakpoint
CREATE OR REPLACE INDEX `mealId_indx` ON `meal_food` (`meal_id`);--> statement-breakpoint
CREATE OR REPLACE INDEX `user_role_usrId_indx` ON `user_role` (`userId`);--> statement-breakpoint
CREATE OR REPLACE INDEX `user_role_roleId_indx` ON `user_role` (`role_id`);--> statement-breakpoint
CREATE OR REPLACE INDEX `nutrientId_indx` ON `recommendation` (`nutrient_id`);--> statement-breakpoint
CREATE OR REPLACE INDEX `physicalTypeId_indx` ON `recommendation` (`physical_type_id`);--> statement-breakpoint
CREATE OR REPLACE INDEX `profileId_indx` ON `profile_label` (`profile_id`);--> statement-breakpoint
CREATE OR REPLACE INDEX `labelId_indx` ON `label_nutrient` (`label_id`);