CREATE TABLE `fdc_nutrient` (
	`fdc_id` bigint unsigned NOT NULL,
	`nutrient_id` bigint unsigned NOT NULL,
	`amount` float NOT NULL,
	CONSTRAINT `fdc_nutrient_primary_key` PRIMARY KEY(`fdc_id`,`nutrient_id`)
);
--> statement-breakpoint
ALTER TABLE `fdc_nutrient` ADD CONSTRAINT `fdc_nutrient_nutrient_id_nutrient_id_fk` FOREIGN KEY (`nutrient_id`) REFERENCES `nutrient`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `fdcId_indx` ON `fdc_nutrient` (`fdc_id`);