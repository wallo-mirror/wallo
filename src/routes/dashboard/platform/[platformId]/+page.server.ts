import type { PageServerLoad } from './$types';
import { fixCase, type CaseDB } from '$lib/types';
import { restrict } from '$lib/string';
import { canEnter } from './auth';

export const load = (async ({ platform, url, locals, params }) => {
	await canEnter(params, platform, locals);

	const order = restrict(url.searchParams.get('order'), ['ASC', 'DESC']) ?? 'ASC';

	const kind =
		restrict(url.searchParams.get('kind'), ['content', 'user', 'community', 'all']) ?? 'all';

	const kindFilterSQL = kind === 'all' ? '' : `WHERE kind = "${kind}"`;

	const status =
		restrict(url.searchParams.get('status'), ['resolved', 'unresolved', 'all']) ?? 'all';

	const statusFilterSql = status === 'all' ? '' : `WHERE status = "${status}"`;

	const whereFilters = [kindFilterSQL, statusFilterSql].filter(Boolean).join(' AND ');

	const column =
		restrict(url.searchParams.get('column'), ['createdAt', 'updatedAt']) ?? 'createdAt';

	const pageIndex = Math.floor(Number(url.searchParams.get('pageIndex')));
	const pageSize = Math.max(Math.floor(Number(url.searchParams.get('pageSize'))), 10);

	const relevantCases = (
		(
			await platform?.env.DB.prepare(
				`SELECT * FROM cases ${whereFilters} ORDER BY ${column} ${order} LIMIT ${pageSize} OFFSET ${pageIndex * pageSize}`
			).all<CaseDB>()
		)?.results ?? []
	).map(fixCase);

	const count =
		(await platform?.env.DB.prepare(
			`SELECT COUNT(*) AS total FROM cases ${whereFilters}`
		).first<number>('total')) ?? 0;

	return {
		relevantCases: relevantCases,
		count
	};
}) satisfies PageServerLoad;
