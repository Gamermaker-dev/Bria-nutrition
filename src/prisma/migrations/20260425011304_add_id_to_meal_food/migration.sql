/*
  Warnings:

  - The primary key for the `mealFood` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `mealFood` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

CREATE TABLE [dbo].[tempMealFood] (
  [mealId] BIGINT NOT NULL,
  [foodId] BIGINT NOT NULL,
  [amount] FLOAT NOT NULL
);

INSERT INTO [dbo].[tempMealFood] (foodId, mealId, amount)
SELECT [foodId], [mealId], [amount]
FROM [dbo].[mealFood];

DROP TABLE [dbo].[mealFood];

CREATE TABLE [dbo].[mealFood] (
  [id] BIGINT IDENTITY(1,1) PRIMARY KEY,
  [mealId] BIGINT NOT NULL,
  [foodId] BIGINT NOT NULL,
  [amount] FLOAT NOT NULL
);

CREATE NONCLUSTERED INDEX [mealIdIndx] ON [dbo].[mealFood]([mealId]);
ALTER TABLE [dbo].[mealFood] ADD CONSTRAINT [mealFoodFoodIdFoodIdFk] FOREIGN KEY ([foodId]) REFERENCES [dbo].[food]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE [dbo].[mealFood] ADD CONSTRAINT [mealFoodMealIdMealIdFk] FOREIGN KEY ([mealId]) REFERENCES [dbo].[meal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

INSERT INTO [dbo].[mealFood] (foodId, mealId, amount)
SELECT [foodId], [mealId], [amount]
FROM [dbo].[tempMealFood]
ORDER BY [mealId];

DROP TABLE [dbo].[tempMealFood];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
