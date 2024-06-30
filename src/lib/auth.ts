import { env } from '$env/dynamic/private';
import { D1Adapter } from '@auth/d1-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import github from '@auth/sveltekit/providers/github';

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => ({
	providers: [
		github({
			clientId: env.AUTH_GITHUB_ID,
			clientSecret: env.AUTH_GITHUB_SECRET
		})
	],
	trustHost: true,
	secret: env.AUTH_SECRET,
	adapter: D1Adapter(event.platform?.env.DB),
	callbacks: {
		session({ session, user }) {
			session.user.id = user.id;
			return session;
		}
	}
}));
