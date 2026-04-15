import { exit } from "node:process";
import { db } from ".";
import { labelNutrient } from "./schema";

const main = async () => {
    console.log('Inserting nutrient mappings...');
    await db.insert(labelNutrient).values(
        [
            { nutrientId: 1, labelId: 1 },
            { nutrientId: 2, labelId: 1 },
            { nutrientId: 10, labelId: 1 },
            { nutrientId: 6, labelId: 13 },
            { nutrientId: 7, labelId: 2 },
            { nutrientId: 52, labelId: 2 },
            { nutrientId: 74, labelId: 2 },
            { nutrientId: 451, labelId: 2 },
            { nutrientId: 5, labelId: 3 },
            { nutrientId: 55, labelId: 3 },
            { nutrientId: 255, labelId: 4 },
            { nutrientId: 95, labelId: 5 },
            { nutrientId: 81, labelId: 6 },
            { nutrientId: 65, labelId: 7 },
            { nutrientId: 416, labelId: 7 },
            { nutrientId: 237, labelId: 8 },
            { nutrientId: 116, labelId: 9 },
            { nutrientId: 89, labelId: 10 },
            { nutrientId: 91, labelId: 11 },
            { nutrientId: 94, labelId: 12 }
        ]
    );
}

main().then(() => exit()).catch(() => exit(1));