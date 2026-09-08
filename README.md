# PrimeHub

PrimeHub is a full-stack ecommerce application with a React/Vite storefront, an Express API, PostgreSQL persistence, customer authentication, Google sign-in, Cloudinary image uploads, Flutterwave payments, cart and wishlist support, and an admin dashboard.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express
- Database: PostgreSQL
- Integrations: Google OAuth, Cloudinary, Flutterwave

## Project Structure

```text
client/       React/Vite frontend
database/     PostgreSQL schema and seed resources
server/       Express API and admin/customer backend
```

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL 14 or newer
- Credentials for the integrations you plan to use

## Setup

### 1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure the server

```bash
cd server
copy .env.example .env
```

On macOS/Linux, use `cp .env.example .env` instead.

Fill in the values in `server/.env`. The Vite development proxy currently points to `http://localhost:3000`, so keep `PORT=3000` for local development unless you also update `client/vite.config.js`.

### 3. Create the database

Create a PostgreSQL database named in `DB_NAME`, then run the schema:

```bash
psql -U postgres -d primehub_db -f database/schema/schema.sql
```

Update the command if your database name or PostgreSQL user is different.

### 4. Start the application

Use two terminals:

```bash
# Terminal 1
cd server
npm start
```

```bash
# Terminal 2
cd client
npm run dev
```

Open `http://localhost:5173` in a browser. The API health check is available at `http://localhost:3000/health`.

## Available Scripts

### Client

```bash
cd client
npm run dev       # Start Vite development server
npm run build     # Create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

### Server

```bash
cd server
npm start         # Start the API server
npm run dev       # Start with nodemon
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and configure:

- PostgreSQL connection settings
- Session secret
- Client URL and API port
- Cloudinary credentials for image uploads
- Google OAuth credentials and callback URL
- Flutterwave payment credentials

Never commit `server/.env` or place production secrets in source control. Rotate any credentials that have previously been exposed.

## OAuth Callback

For local development, configure this callback URL in Google Cloud Console:

```text
http://localhost:3000/api/auth/google/callback
```

For production, use the public HTTPS API URL and update `GOOGLE_REDIRECT_URI` accordingly.

## Production Checklist

- Set `NODE_ENV=production` and use a long random `SESSION_SECRET`.
- Use HTTPS and production callback URLs.
- Configure secure cookies and a production PostgreSQL instance.
- Replace test Flutterwave keys with production keys.
- Restrict Cloudinary and Google credentials to the required environments.
- Build the client with `npm run build` and serve it from your chosen hosting platform.
- Verify payment webhooks, image uploads, authentication, and order stock handling before launch.

## Deploy Frontend to Vercel and API to Render

Deploy the API first, because the frontend needs its public URL.

### Render API

1. Push this repository to GitHub and create a Render **Web Service** from it. The included `render.yaml` can also be used as a Blueprint.
2. Set the service root directory to `server`.
3. Use `npm install` as the build command and `npm start` as the start command.
4. Add a PostgreSQL database and set `DATABASE_URL` to its internal connection string. Run `database/schema/schema.sql` against that database before using the app.
5. Add the variables from `server/.env.example`. Set `NODE_ENV=production`, `CLIENT_URL` to the final Vercel URL, and `GOOGLE_REDIRECT_URI` to `https://YOUR-RENDER-DOMAIN.onrender.com/api/auth/google/callback`.
6. Copy the Render service URL and verify `https://YOUR-RENDER-DOMAIN.onrender.com/health` returns a JSON status of `OK`.

Render supplies `PORT` automatically. Do not commit `server/.env` or production secrets.

### Vercel frontend

1. Import the same repository into Vercel.
2. Set the project root directory to `client`.
3. Use the Vite preset, `npm run build` as the build command, and `dist` as the output directory.
4. Add the environment variable `VITE_API_URL=https://YOUR-RENDER-DOMAIN.onrender.com` and redeploy.
5. Copy the final Vercel URL into Render's `CLIENT_URL`, then redeploy Render.

The Vercel SPA fallback is configured in `vercel.json`. API requests use `VITE_API_URL`, while local development continues to use the Vite proxy.

### Google OAuth and payments

In Google Cloud Console, add this exact production callback:

```text
https://YOUR-RENDER-DOMAIN.onrender.com/api/auth/google/callback
```

Set the payment provider's return/webhook URLs to the deployed API and Vercel URLs required by the provider. Test login, logout, checkout, payment verification, image uploads, and the `/health` endpoint after both deployments are live.
