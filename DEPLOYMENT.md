# Standalone Node.js deployment

## Build

Use Node.js 20.9 or newer, then run:

```bash
pnpm install --frozen-lockfile
pnpm build
```

The deployable application is generated in `.next/standalone`. The build step
also copies `public` and `.next/static` into that directory. Local `.env*` files
are removed from the artifact so deployment secrets are not bundled.

## Deploy

Copy the complete `.next/standalone` directory to the server. The server does
not need the source tree or a separate `pnpm install` step because the traced
runtime dependencies are included.

Set these environment variables on the server:

```text
NODE_ENV=production
MONGODB_URI_PRODUCTION=mongodb://...
AUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.example
PORT=3000
HOSTNAME=0.0.0.0
```

`MONGODB_URI` can be used instead of `MONGODB_URI_PRODUCTION`.

From the copied standalone directory, start the application with:

```bash
node server.js
```

From the project root, the equivalent command is:

```bash
pnpm start
```

Place a reverse proxy such as Nginx or Caddy in front of port 3000 when serving
the application over HTTPS.
