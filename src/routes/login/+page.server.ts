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
    signInEmail: async (event) => {
        const formData = await event.request.formData();

        const result = await auth.api.signInEmail({
            body: {
                email: formData.get('email')?.toString() ?? '',
                password: formData.get('password')?.toString() ?? '',
            }
        });

        if (result.token) {
            return redirect(302, '/');
        }
        return fail(400, { message: 'Social sign-in failed' });
    },
    signInSocial: async (event) => {
        const formData = await event.request.formData();
        const provider = formData.get('provider')?.toString() ?? 'github';
        const callbackURL = formData.get('callbackURL')?.toString() ?? '/';

        const result = await auth.api.signInSocial({
            body: {
                provider: provider as 'github',
                callbackURL
            }
        });

        if (result.url) {
            return redirect(302, result.url);
        }
        return fail(400, { message: 'Social sign-in failed' });
    },
    signOut: async (event) => {
        await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/login');
    }
};
