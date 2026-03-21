CREATE TABLE `ingredient` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`date_added` datetime NOT NULL,
	CONSTRAINT `ingredient_id` PRIMARY KEY(`id`),
	CONSTRAINT `ingredient_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `ingredient_nutrient` (
	`ingredient_id` int NOT NULL,
	`nutrient_id` int NOT NULL,
	`amount` float NOT NULL,
	CONSTRAINT `ingredient_nutrient_ingredient_id` PRIMARY KEY(`ingredient_id`)
);
--> statement-breakpoint
CREATE TABLE `meal` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`added_by` varchar(36) NOT NULL,
	`date_added` datetime NOT NULL,
	`date_updated` datetime,
	`date_deleted` datetime,
	CONSTRAINT `meal_id` PRIMARY KEY(`id`),
	CONSTRAINT `meal_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `meal_category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT `meal_category_id` PRIMARY KEY(`id`),
	CONSTRAINT `meal_category_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `meal_ingredient` (
	`meal_id` int NOT NULL,
	`ingredient_id` int,
	`amount` float NOT NULL,
	CONSTRAINT `meal_ingredient_meal_id` PRIMARY KEY(`meal_id`)
);
--> statement-breakpoint
CREATE TABLE `nutrient` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`date_added` datetime NOT NULL,
	CONSTRAINT `nutrient_id` PRIMARY KEY(`id`),
	CONSTRAINT `nutrient_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`age` int NOT NULL,
	`height_inch` int NOT NULL,
	`height_feet` int NOT NULL,
	`weight` decimal(4,1) NOT NULL,
	`date_added` datetime NOT NULL,
	`date_updated` datetime,
	`date_deleted` datetime,
	CONSTRAINT `profile_id` PRIMARY KEY(`id`),
	CONSTRAINT `profile_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `recommendation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`calories` int NOT NULL,
	`carbs` int NOT NULL,
	`protein` int NOT NULL,
	`fat` int NOT NULL,
	`water` decimal(2,1) NOT NULL,
	`date_added` datetime NOT NULL,
	`date_updated` datetime,
	`date_deleted` datetime,
	CONSTRAINT `recommendation_id` PRIMARY KEY(`id`),
	CONSTRAINT `recommendation_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `recommendation_vitamin` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`vitamin_a` int NOT NULL,
	`vitamin_c` int NOT NULL,
	`vitamin_d` int NOT NULL,
	`vitamin_b6` decimal(2,1) NOT NULL,
	`vitamin_e` int NOT NULL,
	`vitamin_k` int NOT NULL,
	`thiaman` decimal(2,1) NOT NULL,
	`vitamin_b12` decimal(3,1) NOT NULL,
	`riboflavin` decimal(2,1) NOT NULL,
	`folate` int NOT NULL,
	`niacin` int NOT NULL,
	`choline` decimal(3,2),
	`pantothenic_acid` int NOT NULL,
	`biotin` int NOT NULL,
	`date_added` datetime NOT NULL,
	`date_updated` datetime,
	`date_deleted` datetime,
	CONSTRAINT `recommendation_vitamin_id` PRIMARY KEY(`id`),
	CONSTRAINT `recommendation_vitamin_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`priority` int NOT NULL DEFAULT 1,
	CONSTRAINT `task_id` PRIMARY KEY(`id`),
	CONSTRAINT `task_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_meal` (
	`user_id` varchar(36) NOT NULL,
	`meal_id` int NOT NULL,
	`category_id` int NOT NULL,
	`date_added` datetime NOT NULL,
	CONSTRAINT `user_meal_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `account` (
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
CREATE TABLE `session` (
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
CREATE TABLE `user` (
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
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ingredient_nutrient` ADD CONSTRAINT `ingredient_nutrient_ingredient_id_ingredient_id_fk` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ingredient_nutrient` ADD CONSTRAINT `ingredient_nutrient_nutrient_id_nutrient_id_fk` FOREIGN KEY (`nutrient_id`) REFERENCES `nutrient`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meal` ADD CONSTRAINT `meal_added_by_user_id_fk` FOREIGN KEY (`added_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meal_ingredient` ADD CONSTRAINT `meal_ingredient_meal_id_meal_id_fk` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meal_ingredient` ADD CONSTRAINT `meal_ingredient_ingredient_id_ingredient_id_fk` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile` ADD CONSTRAINT `profile_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recommendation` ADD CONSTRAINT `recommendation_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recommendation_vitamin` ADD CONSTRAINT `recommendation_vitamin_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_meal` ADD CONSTRAINT `user_meal_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_meal` ADD CONSTRAINT `user_meal_meal_id_meal_id_fk` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_meal` ADD CONSTRAINT `user_meal_category_id_meal_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `meal_category`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);