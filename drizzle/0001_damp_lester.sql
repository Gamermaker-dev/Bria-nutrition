CREATE OR REPLACE TABLE `vitamin_age_dri` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nutrient_id` int NOT NULL,
	`min_age` int NOT NULL,
	`max_age` int,
	`sex` varchar(6) NOT NULL,
	`is_pregnant` boolean NOT NULL,
	`is_lactating` boolean NOT NULL,
	`amount` float NOT NULL,
	CONSTRAINT `vitamin_age_dri_id` PRIMARY KEY(`id`),
	CONSTRAINT `vitamin_age_dri_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `vitamin_age_dri` ADD CONSTRAINT `vitamin_age_dri_nutrient_id_nutrient_id_fk` FOREIGN KEY (`nutrient_id`) REFERENCES `nutrient`(`id`) ON DELETE no action ON UPDATE no action;