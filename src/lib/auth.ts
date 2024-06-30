import { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, AUTH_SECRET } from '$env/static/private';
import { D1Adapter } from '@auth/d1-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import github from '@auth/sveltekit/providers/github';

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => ({
	providers: [
		github({
			clientId: AUTH_GITHUB_ID,
			clientSecret: AUTH_GITHUB_SECRET
		})
	],
	trustHost: true,
	secret: AUTH_SECRET,
	adapter: D1Adapter(event.platform?.env.DB),
	callbacks: {
		session({ session, user }) {
			session.user.id = user.id;
			return session;
		}
	}
}));
