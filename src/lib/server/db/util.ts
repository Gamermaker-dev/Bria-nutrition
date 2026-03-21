import { error } from "@sveltejs/kit"

export const returnOneRecord = <T> (results: T[]) => {
    if (results.length !== 1) error(500, { message: 'Only expected one record.' });

    return results[0];
}