ALTER TABLE `nutrient` RENAME COLUMN `fdc_numbers` TO `fdc_number`;--> statement-breakpoint
ALTER TABLE `nutrient` MODIFY COLUMN `fdc_number` int NOT NULL;