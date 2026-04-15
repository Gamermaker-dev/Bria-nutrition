ALTER TABLE `recommendation` RENAME COLUMN `nutrient_id` TO `label_id`;--> statement-breakpoint
ALTER TABLE `recommendation` DROP FOREIGN KEY `recommendation_nutrient_id_nutrient_id_fk`;
--> statement-breakpoint
DROP INDEX `nutrientId_indx` ON `recommendation`;--> statement-breakpoint
ALTER TABLE `recommendation` ADD CONSTRAINT `recommendation_label_id_label_id_fk` FOREIGN KEY (`label_id`) REFERENCES `label`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `labelId_indx` ON `recommendation` (`label_id`);