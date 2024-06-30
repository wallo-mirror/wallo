<div align="center">
<h1>Wallo</h1>

Open-Source moderation platform.

<img src="logo.png" alt="Wallo mascot, a little ghost" height="128" />

[![License](https://img.shields.io/gitlab/license/wallo-dev/wallo?style=for-the-badge)](https://gitlab.com/wallo-dev/wallo/-/raw/main/LICENSE)

</div>

## Developing

This application relies on Cloudflare's [wrangler](https://developers.cloudflare.com/workers/wrangler/).

We use [bun](https://bun.sh/) for development, but npm should work fine as well.

We use [Auth.js](https://authjs.dev/) for authentication, and in production we use [GitHub OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) as a provider. If you want to use something else the code for configuring providers is in `src/lib/auth.ts`.

To setup environment variables, create `.dev.vars` file with the following:

```env
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

You can create `AUTH_SECRET` value with:

```bash
openssl rand -base64 33
```

Create a D1 database in Cloudflare and copy its id and name into `wrangler.toml`. Then run:

```bash
bun wrangler d1 execute pluto --local --file src/schema.sql
```

After setting up that you can start a server with:

```bash
bun run preview
```

To create a hot-reload server instead, use:

```bash
bun run dev
```

Some functionality is limited in hot-reload due to limitations of wrangler.

## Deployment

Make sure you're logged in with:

```bash
bun wrangler login
```

Set up the remote database:

```bash
bun wrangler d1 execute pluto --remote --file src/schema.sql
```

And then deploy:

```bash
bun wrangler deploy
```

## API

There's only one incoming API at the moment:

```http
POST /v0/api/requestPublication
Content-Type: application/json
Authorization: Basic {SECRET}
{
    id: string;
    clientId: string;
    kind: 'content';
}
```

Where `id` is the content id, and `clientId` being the id relating to the platform.

Wallo also makes a callback request either of two types:

```http
POST {CALLBACK URL}
Content-Type: application/json
Authorization: Basic {SECRET}
{
    kind: 'content';
    relevantId: string;
}

```

Of which the callback URL should respond with the content that the `relevantId` is associated with.

It should respond with the following format:

```ts
type Response = {
	medias: Media[];
	possibleActions: PossibleAction[];
};

type PossibleAction = {
	id: string;
	display?: string;
	variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

type Media =
	| {
			kind: 'text';
			message: string;
			tag?: string;
	  }
	| {
			kind: 'image';
			url: string;
			alt?: string;
			tag?: string;
	  }
	| {
			kind: 'video';
			url: string;
			tag?: string;
	  };
```

The second call is made when an action has been done:

```http
POST {CALLBACK URL}
Content-Type: application/json
Authorization: Basic {SECRET}
{
    kind: 'content';
    relevantId: string;
    action: string;
}

```
