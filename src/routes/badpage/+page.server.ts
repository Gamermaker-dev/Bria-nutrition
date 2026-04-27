import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const data = 5/0;
    throw error(503, { message: 'Unable to load page. Please try again later.' });
    return { data };
}