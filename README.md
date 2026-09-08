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
