BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[account] (
    [id] VARCHAR(36) NOT NULL,
    [accountId] NVARCHAR(450) NOT NULL,
    [providerId] NVARCHAR(450) NOT NULL,
    [userId] VARCHAR(36) NOT NULL,
    [accessToken] NVARCHAR(450),
    [refreshToken] NVARCHAR(450),
    [idToken] NVARCHAR(450),
    [accessTokenExpiresAt] DATETIME2,
    [refreshTokenExpiresAt] DATETIME2,
    [scope] NVARCHAR(450),
    [password] NVARCHAR(450),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [account_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [account_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[activityLevel] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [description] NVARCHAR(450) NOT NULL,
    [multiplier] DECIMAL(4,3),
    [dateAdded] DATETIME2 NOT NULL,
    CONSTRAINT [activityLevel_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [activityLevelIdUnique] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [activityLevelNameUnique] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[fdcNutrient] (
    [fdcId] BIGINT NOT NULL,
    [nutrientId] BIGINT NOT NULL,
    [amount] FLOAT NOT NULL,
    CONSTRAINT [fdcNutrient_pkey] PRIMARY KEY CLUSTERED ([fdcId],[nutrientId])
);

-- CreateTable
CREATE TABLE [dbo].[food] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [fdcId] INT,
    [userId] VARCHAR(36),
    [dateAdded] DATETIME2 NOT NULL,
    CONSTRAINT [food_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [foodIdUnique] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[foodNutrient] (
    [foodId] BIGINT NOT NULL,
    [nutrientId] BIGINT NOT NULL,
    [amount] FLOAT NOT NULL,
    CONSTRAINT [foodNutrient_pkey] PRIMARY KEY CLUSTERED ([foodId],[nutrientId])
);

-- CreateTable
CREATE TABLE [dbo].[label] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [dateAdded] DATETIME2 NOT NULL,
    CONSTRAINT [label_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [labelIdUnique] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [labelNameUnique] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[labelNutrient] (
    [labelId] BIGINT NOT NULL,
    [nutrientId] BIGINT NOT NULL,
    CONSTRAINT [labelNutrient_pkey] PRIMARY KEY CLUSTERED ([labelId],[nutrientId])
);

-- CreateTable
CREATE TABLE [dbo].[meal] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [mealDate] DATE NOT NULL,
    [userId] VARCHAR(36) NOT NULL,
    [dateAdded] DATETIME2 NOT NULL,
    [dateUpdated] DATETIME2,
    [dateDeleted] DATETIME2,
    CONSTRAINT [meal_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mealIdUnique] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [userMealIndx] UNIQUE NONCLUSTERED ([mealDate],[userId])
);

-- CreateTable
CREATE TABLE [dbo].[mealFood] (
    [mealId] BIGINT NOT NULL,
    [foodId] BIGINT NOT NULL,
    [amount] FLOAT NOT NULL,
    CONSTRAINT [mealFood_pkey] PRIMARY KEY CLUSTERED ([mealId],[foodId])
);

-- CreateTable
CREATE TABLE [dbo].[nutrient] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [unit] NVARCHAR(450) NOT NULL,
    [fdcNumber] INT NOT NULL,
    [dateAdded] DATETIME2 NOT NULL,
    [fdcNutrientId] BIGINT NOT NULL,
    CONSTRAINT [nutrient_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [nutrientUdUnique] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[physicalType] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [dateAdded] DATETIME2 NOT NULL,
    CONSTRAINT [physicalType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [physicalTypeUniqueId] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[profile] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [userId] VARCHAR(36) NOT NULL,
    [birthDate] DATETIME2 NOT NULL,
    [physicalTypeId] BIGINT NOT NULL,
    [heightInch] INT NOT NULL,
    [heightFeet] INT NOT NULL,
    [weight] DECIMAL(4,1) NOT NULL,
    [activityLevelId] BIGINT NOT NULL,
    [age] INT,
    [nextProfileId] BIGINT,
    [dateAdded] DATETIME2 NOT NULL,
    [dateUpdated] DATETIME2,
    [dateDeleted] DATETIME2,
    CONSTRAINT [profile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [profileUniqueId] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[profileLabel] (
    [profileId] BIGINT NOT NULL,
    [labelId] BIGINT NOT NULL,
    CONSTRAINT [profileLabel_pkey] PRIMARY KEY CLUSTERED ([profileId],[labelId])
);

-- CreateTable
CREATE TABLE [dbo].[recommendation] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [labelId] BIGINT NOT NULL,
    [minAge] INT NOT NULL,
    [maxAge] INT,
    [physicalTypeId] BIGINT NOT NULL,
    [amount] FLOAT NOT NULL,
    CONSTRAINT [recommendation_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [recommendationUniqueId] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[role] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(450) NOT NULL,
    [dateAdded] DATETIME2 NOT NULL,
    CONSTRAINT [role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [roleIdUnique] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[session] (
    [id] VARCHAR(36) NOT NULL,
    [expiresAt] DATETIME2 NOT NULL,
    [token] VARCHAR(255) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [session_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [ipAddress] NVARCHAR(450),
    [userAgent] NVARCHAR(450),
    [userId] VARCHAR(36) NOT NULL,
    CONSTRAINT [session_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [sessionTokenUnique] UNIQUE NONCLUSTERED ([token])
);

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] VARCHAR(36) NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [email] VARCHAR(255) NOT NULL,
    [emailVerified] BIT NOT NULL CONSTRAINT [user_emailVerified_df] DEFAULT 0,
    [image] NVARCHAR(450),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [user_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [user_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [userEmailUnique] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[userRole] (
    [userId] VARCHAR(36) NOT NULL,
    [roleId] BIGINT NOT NULL,
    [dateAdded] DATETIME2 NOT NULL,
    CONSTRAINT [userRole_pkey] PRIMARY KEY CLUSTERED ([userId],[roleId])
);

-- CreateTable
CREATE TABLE [dbo].[verification] (
    [id] VARCHAR(36) NOT NULL,
    [identifier] VARCHAR(255) NOT NULL,
    [value] NVARCHAR(450) NOT NULL,
    [expiresAt] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [verification_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [verification_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [verification_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [accountUserIdIdx] ON [dbo].[account]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [fdcIdIndx] ON [dbo].[fdcNutrient]([fdcId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [fdcNutrientNutrientIdNutrientIdFk] ON [dbo].[fdcNutrient]([nutrientId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [userIdIndx] ON [dbo].[food]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [foodIdIndx] ON [dbo].[foodNutrient]([foodId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [foodNutrientNutrientIdNutrientIdFk] ON [dbo].[foodNutrient]([nutrientId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [labelIdIndx] ON [dbo].[labelNutrient]([labelId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [labelNutrientNutrientIdNutrientIdFk] ON [dbo].[labelNutrient]([nutrientId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [mealUserIdUserIdFk] ON [dbo].[meal]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [mealIdIndx] ON [dbo].[mealFood]([mealId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [mealFoodFoodIdFoodIdFk] ON [dbo].[mealFood]([foodId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [nextProfileForeignKey] ON [dbo].[profile]([nextProfileId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [profileActivityLevelIdActivityLevelIdFk] ON [dbo].[profile]([activityLevelId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [profilePhysicalTypeIdPhysicalTypeIdFk] ON [dbo].[profile]([physicalTypeId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [userIdIndx] ON [dbo].[profile]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [profileIdIndx] ON [dbo].[profileLabel]([profileId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [profileLabelLabelIdLabelIdFk] ON [dbo].[profileLabel]([labelId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [labelIdIndx] ON [dbo].[recommendation]([labelId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [physicalTypeIdIndx] ON [dbo].[recommendation]([physicalTypeId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [sessionUserIdIdx] ON [dbo].[session]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [userRoleRoleIdIndx] ON [dbo].[userRole]([roleId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [userRoleUsrIdIndx] ON [dbo].[userRole]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [verification_identifier_idx] ON [dbo].[verification]([identifier]);

-- AddForeignKey
ALTER TABLE [dbo].[account] ADD CONSTRAINT [accountUserIdUserIdFk] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[foodNutrient] ADD CONSTRAINT [foodNutrientFoodIdFoodIdFk] FOREIGN KEY ([foodId]) REFERENCES [dbo].[food]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[foodNutrient] ADD CONSTRAINT [foodNutrientNutrientIdNutrientIdFk] FOREIGN KEY ([nutrientId]) REFERENCES [dbo].[nutrient]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[labelNutrient] ADD CONSTRAINT [labelNutrientLabelIdLabelIdFk] FOREIGN KEY ([labelId]) REFERENCES [dbo].[label]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[labelNutrient] ADD CONSTRAINT [labelNutrientNutrientIdNutrientIdFk] FOREIGN KEY ([nutrientId]) REFERENCES [dbo].[nutrient]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[meal] ADD CONSTRAINT [mealUserIdUserIdFk] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mealFood] ADD CONSTRAINT [mealFoodFoodIdFoodIdFk] FOREIGN KEY ([foodId]) REFERENCES [dbo].[food]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mealFood] ADD CONSTRAINT [mealFoodMealIdMealIdFk] FOREIGN KEY ([mealId]) REFERENCES [dbo].[meal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile] ADD CONSTRAINT [nextProfileForeignKey] FOREIGN KEY ([nextProfileId]) REFERENCES [dbo].[profile]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile] ADD CONSTRAINT [profileActivityLevelIdActivityLevelIdFk] FOREIGN KEY ([activityLevelId]) REFERENCES [dbo].[activityLevel]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile] ADD CONSTRAINT [profilePhysicalTypeIdPhysicalTypeIdFk] FOREIGN KEY ([physicalTypeId]) REFERENCES [dbo].[physicalType]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile] ADD CONSTRAINT [profileUserIdUserIdFk] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profileLabel] ADD CONSTRAINT [profileLabelLabelIdLabelIdFk] FOREIGN KEY ([labelId]) REFERENCES [dbo].[label]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profileLabel] ADD CONSTRAINT [profileLabelProfileIdProfileIdFk] FOREIGN KEY ([profileId]) REFERENCES [dbo].[profile]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[recommendation] ADD CONSTRAINT [recommendationLabelIdLabelIdFk] FOREIGN KEY ([labelId]) REFERENCES [dbo].[label]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[recommendation] ADD CONSTRAINT [recommendationPhysicalTypeIdPhysicalTypeIdFk] FOREIGN KEY ([physicalTypeId]) REFERENCES [dbo].[physicalType]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[session] ADD CONSTRAINT [sessionUserIdUserIdFk] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userRole] ADD CONSTRAINT [userRoleRoleIdRoleIdFk] FOREIGN KEY ([roleId]) REFERENCES [dbo].[role]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userRole] ADD CONSTRAINT [userRoleUserIdUserIdFk] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
