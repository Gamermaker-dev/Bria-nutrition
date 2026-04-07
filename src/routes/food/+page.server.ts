import type { FoodInput } from "$lib/server/db/schema";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async (event) => {
        let formData = await event.request.formData();

        // get carbs, protein, fat, iron, calcium, vitamin A, vitamin C, B12, folate, potassium
        
        
        // const foodInput: FoodInput = {
        //     name:
        // }
    }
}