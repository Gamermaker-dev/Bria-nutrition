import { db } from ".";
import { activityLevel, label, physicalType } from "./schema";

const main = async () => {
    console.log("Inserting physical body types...");
    await db.insert(physicalType).values(
        [{ name: 'Male' }, { name: 'Female' }, { name: 'Pregnant' }, { name: 'Lactating' }]
    );

    console.log("Inserting activity levels...");
    await db.insert(activityLevel).values(
        [
            { name: 'Sedentary', multiplier: '1.2', description: '< 1 day of exercise' },
            { name: 'Light', multiplier: '1.375', description: '1-3 days of exercise' },
            { name: 'Moderate', multiplier: '1.55', description: '3-5 days of exercise' },
            { name: 'Very', multiplier: '1.725', description: '6-7 days of exercise'},
            { name: 'Extreme', multiplier: '1.9', description: '7+ days of exercise' },
        ]
    );

    console.log("Inserting labels...");
    await db.insert(label).values(
        [
            { name: 'Calories' },
            { name: 'Carbs' },
            { name: 'Protein' },
            { name: 'Cholesterol' },
            { name: 'Sodium' },
            { name: 'Fiber' },
            { name: 'Total Sugars' },
            { name: 'Added Sugars' },
            { name: 'Vitamin D' },
            { name: 'Calcium' },
            { name: 'Iron' },
            { name: 'Potassium' }
        ]
    );
}

main();