import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Orgnaization, Platform } from '$lib/types';

export const load = (async (event) => {
	const { session } = await event.parent();

	const userId = session?.user?.id;

	if (!userId) redirect(303, '/');

	const organizationsAdminOf =
		(
			await event.platform?.env.DB.prepare('SELECT * FROM organizations WHERE adminId = ?')
				.bind(userId)
				.all<Orgnaization>()
		)?.results ?? [];

	const platformsModeratorOf =
		(
			await event.platform?.env.DB.prepare(
				'SELECT p.* FROM platforms p JOIN platformModerators pm ON p.id = pm.platformId WHERE pm.userId = ?'
			)
				.bind(userId)
				.all<Platform>()
		)?.results ?? [];

	const platformsAdminOf =
		(
			await event.platform?.env.DB.prepare(
				`SELECT p.*
				FROM organizations o
				JOIN platforms p ON o.id = p.organizationId
				WHERE o.adminId = ?`
			)
				.bind(userId)
				.all<Platform>()
		)?.results ?? [];

	return {
		organizationsAdminOf,
		platformsModeratorOf,
		platformsAdminOf
	};
}) satisfies PageServerLoad;
