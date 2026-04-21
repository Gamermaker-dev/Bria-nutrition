BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[account] (
    [id] VARCHAR(36) NOT NULL,
    [account_id] NVARCHAR(450) NOT NULL,
    [provider_id] NVARCHAR(450) NOT NULL,
    [user_id] VARCHAR(36) NOT NULL,
    [access_token] NVARCHAR(450),
    [refresh_token] NVARCHAR(450),
    [id_token] NVARCHAR(450),
    [access_token_expires_at] DATETIME2,
    [refresh_token_expires_at] DATETIME2,
    [scope] NVARCHAR(450),
    [password] NVARCHAR(450),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [account_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [account_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[activity_level] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [description] NVARCHAR(450) NOT NULL,
    [multiplier] DECIMAL(4,3),
    [date_added] DATETIME2 NOT NULL,
    CONSTRAINT [activity_level_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [activity_level_id_unique] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [activity_level_name_unique] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[fdc_nutrient] (
    [fdc_id] BIGINT NOT NULL,
    [nutrient_id] BIGINT NOT NULL,
    [amount] FLOAT NOT NULL,
    CONSTRAINT [fdc_nutrient_pkey] PRIMARY KEY CLUSTERED ([fdc_id],[nutrient_id])
);

-- CreateTable
CREATE TABLE [dbo].[food] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [fdcId] INT,
    [user_id] VARCHAR(36),
    [date_added] DATETIME2 NOT NULL,
    CONSTRAINT [food_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [food_id_unique] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[food_nutrient] (
    [food_id] BIGINT NOT NULL,
    [nutrient_id] BIGINT NOT NULL,
    [amount] FLOAT NOT NULL,
    CONSTRAINT [food_nutrient_pkey] PRIMARY KEY CLUSTERED ([food_id],[nutrient_id])
);

-- CreateTable
CREATE TABLE [dbo].[label] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [date_added] DATETIME2 NOT NULL,
    CONSTRAINT [label_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [label_id_unique] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [label_name_unique] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[label_nutrient] (
    [label_id] BIGINT NOT NULL,
    [nutrient_id] BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE [dbo].[meal] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [meal_date] DATE NOT NULL,
    [user_id] VARCHAR(36) NOT NULL,
    [date_added] DATETIME2 NOT NULL,
    [date_updated] DATETIME2,
    [date_deleted] DATETIME2,
    CONSTRAINT [meal_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [meal_id_unique] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [userMeal_indx] UNIQUE NONCLUSTERED ([meal_date],[user_id])
);

-- CreateTable
CREATE TABLE [dbo].[meal_food] (
    [meal_id] BIGINT NOT NULL,
    [food_id] BIGINT NOT NULL,
    [amount] FLOAT NOT NULL,
    CONSTRAINT [meal_food_pkey] PRIMARY KEY CLUSTERED ([meal_id],[food_id])
);

-- CreateTable
CREATE TABLE [dbo].[nutrient] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [unit] NVARCHAR(450) NOT NULL,
    [fdc_number] INT NOT NULL,
    [date_added] DATETIME2 NOT NULL,
    [fdc_nutrient_id] BIGINT NOT NULL,
    CONSTRAINT [nutrient_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [nutrient_ud_unique] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[physical_type] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [date_added] DATETIME2 NOT NULL,
    CONSTRAINT [physical_type_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [physical_type_unique_id] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[profile] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [user_id] VARCHAR(36) NOT NULL,
    [birth_date] DATETIME2 NOT NULL,
    [physical_type_id] BIGINT NOT NULL,
    [height_inch] INT NOT NULL,
    [height_feet] INT NOT NULL,
    [weight] DECIMAL(4,1) NOT NULL,
    [activityLevelId] BIGINT NOT NULL,
    [age] INT,
    [next_profile_id] BIGINT,
    [date_added] DATETIME2 NOT NULL,
    [date_updated] DATETIME2,
    [date_deleted] DATETIME2,
    CONSTRAINT [profile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [profile_unique_id] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[profile_label] (
    [profile_id] BIGINT NOT NULL,
    [label_id] BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE [dbo].[recommendation] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [label_id] BIGINT NOT NULL,
    [min_age] INT NOT NULL,
    [max_age] INT,
    [physical_type_id] BIGINT NOT NULL,
    [amount] FLOAT NOT NULL,
    CONSTRAINT [recommendation_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [recommendation_unique_id] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[role] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [date_added] DATETIME2 NOT NULL,
    CONSTRAINT [role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [role_id_unique] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[session] (
    [id] VARCHAR(36) NOT NULL,
    [expires_at] DATETIME2 NOT NULL,
    [token] VARCHAR(255) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [session_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    [ip_address] NVARCHAR(450),
    [user_agent] NVARCHAR(450),
    [user_id] VARCHAR(36) NOT NULL,
    CONSTRAINT [session_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [session_token_unique] UNIQUE NONCLUSTERED ([token])
);

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] VARCHAR(36) NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [email] VARCHAR(255) NOT NULL,
    [email_verified] BIT NOT NULL CONSTRAINT [user_email_verified_df] DEFAULT 0,
    [image] NVARCHAR(450),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [user_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [user_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_email_unique] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[user_role] (
    [userId] VARCHAR(36) NOT NULL,
    [role_id] BIGINT NOT NULL,
    [date_added] DATETIME2 NOT NULL,
    CONSTRAINT [user_role_pkey] PRIMARY KEY CLUSTERED ([userId],[role_id])
);

-- CreateTable
CREATE TABLE [dbo].[verification] (
    [id] VARCHAR(36) NOT NULL,
    [identifier] VARCHAR(255) NOT NULL,
    [value] NVARCHAR(450) NOT NULL,
    [expires_at] DATETIME2 NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [verification_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [verification_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [verification_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [account_userId_idx] ON [dbo].[account]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [fdcId_indx] ON [dbo].[fdc_nutrient]([fdc_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [fdc_nutrient_nutrient_id_nutrient_id_fk] ON [dbo].[fdc_nutrient]([nutrient_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [userId_indx] ON [dbo].[food]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [foodId_indx] ON [dbo].[food_nutrient]([food_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [food_nutrient_nutrient_id_nutrient_id_fk] ON [dbo].[food_nutrient]([nutrient_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [labelId_indx] ON [dbo].[label_nutrient]([label_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [label_nutrient_nutrient_id_nutrient_id_fk] ON [dbo].[label_nutrient]([nutrient_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [meal_user_id_user_id_fk] ON [dbo].[meal]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [mealId_indx] ON [dbo].[meal_food]([meal_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [meal_food_food_id_food_id_fk] ON [dbo].[meal_food]([food_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [next_profile_foreignKey] ON [dbo].[profile]([next_profile_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [profile_activityLevelId_activity_level_id_fk] ON [dbo].[profile]([activityLevelId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [profile_physical_type_id_physical_type_id_fk] ON [dbo].[profile]([physical_type_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [userId_indx] ON [dbo].[profile]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [profileId_indx] ON [dbo].[profile_label]([profile_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [profile_label_label_id_label_id_fk] ON [dbo].[profile_label]([label_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [labelId_indx] ON [dbo].[recommendation]([label_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [physicalTypeId_indx] ON [dbo].[recommendation]([physical_type_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [session_userId_idx] ON [dbo].[session]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [user_role_roleId_indx] ON [dbo].[user_role]([role_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [user_role_usrId_indx] ON [dbo].[user_role]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [verification_identifier_idx] ON [dbo].[verification]([identifier]);

-- AddForeignKey
ALTER TABLE [dbo].[account] ADD CONSTRAINT [account_user_id_user_id_fk] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[food_nutrient] ADD CONSTRAINT [food_nutrient_food_id_food_id_fk] FOREIGN KEY ([food_id]) REFERENCES [dbo].[food]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[food_nutrient] ADD CONSTRAINT [food_nutrient_nutrient_id_nutrient_id_fk] FOREIGN KEY ([nutrient_id]) REFERENCES [dbo].[nutrient]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[label_nutrient] ADD CONSTRAINT [label_nutrient_label_id_label_id_fk] FOREIGN KEY ([label_id]) REFERENCES [dbo].[label]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[label_nutrient] ADD CONSTRAINT [label_nutrient_nutrient_id_nutrient_id_fk] FOREIGN KEY ([nutrient_id]) REFERENCES [dbo].[nutrient]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[meal] ADD CONSTRAINT [meal_user_id_user_id_fk] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[meal_food] ADD CONSTRAINT [meal_food_food_id_food_id_fk] FOREIGN KEY ([food_id]) REFERENCES [dbo].[food]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[meal_food] ADD CONSTRAINT [meal_food_meal_id_meal_id_fk] FOREIGN KEY ([meal_id]) REFERENCES [dbo].[meal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile] ADD CONSTRAINT [next_profile_foreignKey] FOREIGN KEY ([next_profile_id]) REFERENCES [dbo].[profile]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile] ADD CONSTRAINT [profile_activityLevelId_activity_level_id_fk] FOREIGN KEY ([activityLevelId]) REFERENCES [dbo].[activity_level]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile] ADD CONSTRAINT [profile_physical_type_id_physical_type_id_fk] FOREIGN KEY ([physical_type_id]) REFERENCES [dbo].[physical_type]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile] ADD CONSTRAINT [profile_user_id_user_id_fk] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile_label] ADD CONSTRAINT [profile_label_label_id_label_id_fk] FOREIGN KEY ([label_id]) REFERENCES [dbo].[label]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile_label] ADD CONSTRAINT [profile_label_profile_id_profile_id_fk] FOREIGN KEY ([profile_id]) REFERENCES [dbo].[profile]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[recommendation] ADD CONSTRAINT [recommendation_label_id_label_id_fk] FOREIGN KEY ([label_id]) REFERENCES [dbo].[label]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[recommendation] ADD CONSTRAINT [recommendation_physical_type_id_physical_type_id_fk] FOREIGN KEY ([physical_type_id]) REFERENCES [dbo].[physical_type]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[session] ADD CONSTRAINT [session_user_id_user_id_fk] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[user_role] ADD CONSTRAINT [user_role_role_id_role_id_fk] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[user_role] ADD CONSTRAINT [user_role_userId_user_id_fk] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
