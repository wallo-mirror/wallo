import type { Orgnaization, Platform } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, platform, locals }) => {
	const session = await locals.auth();
	const userId = session?.user?.id;
	if (!userId) redirect(303, '/auth/signin');
	const { organizationId } = params;

	const organization =
		(await platform?.env.DB.prepare('SELECT * FROM organizations WHERE id = ? AND adminId = ?')
			.bind(organizationId, userId)
			.first<Orgnaization>()) ?? null;

	if (organization === null) redirect(303, '/dashboard');

	const platforms = (
		(
			await platform?.env.DB.prepare(
				`SELECT p.*
				FROM organizations o
				INNER JOIN platforms p ON o.id = p.organizationId
				WHERE o.id = ?`
			)
				.bind(organizationId)
				.all<Platform>()
		)?.results ?? []
	).map((p) => ({ id: p.id, name: p.name }));

	return {
		organization,
		platforms
	};
}) satisfies PageServerLoad;
