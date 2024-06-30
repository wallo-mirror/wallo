import type { Platform } from '$lib/types';
import type { RequestHandler } from './$types';
import { timingSafeEqual } from '$lib/crypto';

export const POST: RequestHandler = async ({ request, platform }) => {
	const clientSecret = request.headers.get('Authorization')?.split(' ').at(-1);

	const { id, clientId, kind } = await request.json<{
		id: string;
		clientId: string;
		kind: 'content' | 'account' | 'community';
	}>();

	const client =
		(await platform?.env.DB.prepare('SELECT * FROM platforms WHERE id = ?')
			.bind(clientId)
			.first<Platform>()) ?? null;

	if (!client) return new Response('', { status: 400 });

	if (!timingSafeEqual(clientSecret ?? '', client.secret))
		return new Response('Wrong API Key', { status: 403 });

	await platform?.env.DB.prepare(
		'INSERT INTO cases (platformId, relevantId, kind, status) VALUES (?, ?, ?, ?)'
	)
		.bind(clientId, id, kind, 'unresolved')
		.run();

	await platform?.env.DB.prepare(
		'INSERT INTO actions (platformId, relevantId, kind, actionInfo) VALUES (?, ?, ?, ?)'
	)
		.bind(clientId, id, kind, '{"kind":"requestPublication"}')
		.run();

	return new Response();
};
