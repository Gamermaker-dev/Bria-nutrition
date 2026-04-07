import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { usdaApi } from "$lib/server/controllers";

export const GET: RequestHandler = async ({ url }) => {
    const search = url.searchParams.get("search");

    if (!search) return json({ status: 400, data: [], error: 'Bad request' });

    const data = await usdaApi.searchFoods(search, 1);

    return json({ status: 200, data, error: ''});
}