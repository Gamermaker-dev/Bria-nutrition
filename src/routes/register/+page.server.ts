import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
    if (event.locals.user) {
        return redirect(302, '/');
    }
    return {};
};

export const actions: Actions = {
    signUp: async (event) => {
        const formData = await event.request.formData();

        const result = await auth.api.signUpEmail({
            body: {
                email: formData.get('email')?.toString() ?? '',
                password: formData.get('password')?.toString() ?? '',
                name: formData.get('name')?.toString() ?? ''
            }
        });

        if (result.token) {
            return redirect(302, '/');
        }
        return fail(400, { message: 'Sign up failed!' });
    }
};
