import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RouteParams } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import type { Orgnaization, Platform } from '$lib/types';
import { generateRandomHex } from '$lib/crypto';

async function isAuth({
	locals,
	platform,
	params
}: {
	locals: App.Locals;
	platform: Readonly<App.Platform> | undefined;
	params: RouteParams;
}): Promise<{
	moderationPlatform: Platform;
	organization: Orgnaization;
}> {
	const session = await locals.auth();
	const userId = session?.user?.id;
	if (!userId) redirect(303, '/auth/signin');
	const { platformId } = params;

	const moderationPlatform = await platform?.env.DB.prepare(`SELECT * FROM platforms WHERE id = ?`)
		.bind(platformId)
		.first<Platform>();

	if (!moderationPlatform) throw fail(404);

	const { organizationId } = moderationPlatform;

	const organization = await platform?.env.DB.prepare(
		'SELECT * FROM organizations WHERE id = ? AND adminId = ?'
	)
		.bind(organizationId, userId)
		.first<Orgnaization>();

	if (!organization) redirect(303, '/dashboard');

	return {
		moderationPlatform,
		organization
	};
}

export const load = (async ({ locals, platform, params }) => {
	const { moderationPlatform, organization } = await isAuth({ locals, platform, params });

	return {
		organization,
		form: await superValidate(
			{
				platformName: moderationPlatform.name,
				callbackUrl: moderationPlatform.callbackUrl,
				secret: moderationPlatform.secret
			},
			zod(formSchema)
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	update: async (event) => {
		const { locals, params, platform } = event;

		const { moderationPlatform, organization } = await isAuth({ locals, platform, params });

		if (organization === null) return fail(403);

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { platformName, callbackUrl } = form.data;

		const platformId = moderationPlatform.id;

		await platform?.env.DB.prepare(`UPDATE platforms SET name = ?, callbackUrl = ? WHERE id = ?`)
			.bind(platformName, callbackUrl, platformId)
			.run();

		return { form };
	},
	delete: async ({ locals, params, platform }) => {
		const { moderationPlatform } = await isAuth({ locals, platform, params });

		await platform?.env.DB.prepare(`DELETE FROM platforms WHERE id = ?`)
			.bind(moderationPlatform.id)
			.run();

		redirect(303, '/dashboard');
	},
	regenerate: async (event) => {
		const { locals, params, platform } = event;
		const { moderationPlatform } = await isAuth({ locals, platform, params });

		const secret = generateRandomHex(40);

		await platform?.env.DB.prepare(`UPDATE platforms SET secret = ? WHERE id = ?`)
			.bind(secret, moderationPlatform.id)
			.run();

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		return {
			...form,
			data: {
				...form.data,
				secret
			}
		};
	}
};
