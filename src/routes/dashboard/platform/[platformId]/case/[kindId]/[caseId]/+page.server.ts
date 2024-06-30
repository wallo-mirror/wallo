import {
	fixAction,
	fixCase,
	type Account,
	type ActionDB,
	type CaseDB,
	type Community,
	type Content,
	type CustomAction,
	type DiscussionAction,
	type PlatformAction
} from '$lib/types';
import { fail } from '@sveltejs/kit';
import { canEnter } from '../../../auth';
import type { Actions, PageServerLoad } from './$types';
import { commentFormSchema } from './comment-schema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { actionFormSchema } from './action-schema';
import { redirectMe } from '../../../queue';
import { skip } from './queue';

export const load = (async ({ params, platform, locals }) => {
	const { moderationPlatform } = await canEnter(params, platform, locals);
	const moderationCase = await platform?.env.DB.prepare(
		'SELECT * FROM cases WHERE platformId = ? AND relevantId = ? AND kind = ?'
	)
		.bind(moderationPlatform.id, params.caseId, params.kindId)
		.first<CaseDB>();

	if (!moderationCase) throw fail(404);

	const url = new URL(moderationPlatform.callbackUrl);

	const resp = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${moderationPlatform.secret}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			kind: params.kindId,
			relevantId: params.caseId
		})
	});

	if (!resp.ok) throw fail(500);

	const subject = await resp.json<Account | Community | Content>();

	const actions = (
		(
			await platform?.env.DB.prepare(
				`SELECT actions.*, users.name 
				FROM actions 
				LEFT JOIN users ON actions.authorId = users.id 
				WHERE actions.platformId = ? AND actions.relevantId = ? AND actions.kind = ?`
			)
				.bind(moderationPlatform.id, params.caseId, params.kindId)
				.all<ActionDB>()
		)?.results ?? []
	).map(fixAction);

	return {
		moderationCase: fixCase(moderationCase),
		kind: params.kindId,
		subject,
		actions,
		commentForm: await superValidate(zod(commentFormSchema)),
		actionForm: await superValidate(zod(actionFormSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	comment: async (event) => {
		const { moderationPlatform, userId } = await canEnter(
			event.params,
			event.platform,
			event.locals
		);

		const form = await superValidate(event, zod(commentFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		await event.platform?.env.DB.prepare(
			'INSERT INTO actions(platformId, relevantId, authorId, kind, actionInfo) VALUES(?, ?, ?, ?, ?)'
		)
			.bind(
				moderationPlatform.id,
				event.params.caseId,
				userId,
				event.params.kindId,
				JSON.stringify({
					kind: 'comment',
					text: form.data.comment
				} satisfies CustomAction | DiscussionAction | PlatformAction)
			)
			.run();

		return { success: true };
	},
	action: async (event) => {
		const { moderationPlatform, userId } = await canEnter(
			event.params,
			event.platform,
			event.locals
		);

		const form = await superValidate(event, zod(actionFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (form.data.id === '__skip__') {
			await skip(userId, { ...event });
		} else {
			await event.platform?.env.DB.prepare(
				'INSERT INTO actions(platformId, relevantId, authorId, kind, actionInfo) VALUES(?, ?, ?, ?, ?)'
			)
				.bind(
					moderationPlatform.id,
					event.params.caseId,
					userId,
					event.params.kindId,
					JSON.stringify({
						kind: 'custom',
						id: form.data.id,
						display: form.data.display ?? form.data.id
					} satisfies CustomAction | DiscussionAction | PlatformAction)
				)
				.run();

			await fetch(moderationPlatform.callbackUrl, {
				method: 'POST',
				headers: {
					Authorization: `Basic ${moderationPlatform.secret}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					kind: event.params.kindId,
					relevantId: event.params.caseId,
					action: form.data.id
				})
			});

			await event.platform?.env.DB.prepare(
				`UPDATE cases
					SET status = 'resolved'
					WHERE platformId = ?1
						AND relevantId = ?2
						AND kind = ?3`
			)
				.bind(moderationPlatform.id, event.params.caseId, event.params.kindId)
				.run();
		}

		await redirectMe(userId, { ...event });
	}
};