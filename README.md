# KDLS Portfolio

This project powers the KDLS portfolio using Next.js 14, TypeScript, and Tailwind CSS. In addition to the public site, it now ships a private administrator area for maintaining Credly embeds.

## Environment variables

Create a `.env.local` file with the following variables:

```bash
# Derived using the script documented below
ADMIN_PASSWORD_HASH="scrypt$..."

# Random 32+ byte secret used to sign session & CSRF tokens
ADMIN_SESSION_SECRET="generate-a-long-random-string"
```

To generate the password hash, run the helper script from the project root:

```bash
node scripts/hash-admin-password.js "your-admin-password"
```

Copy the output into `ADMIN_PASSWORD_HASH`. Re-run the script whenever you rotate credentials.

## Manual verification checklist

After configuring the environment variables and starting the dev server (`npm run dev`):

1. **Invalid password is rejected** – submitting a wrong password on `/admin/login` redirects back with an error banner.
2. **Successful login persists** – signing in with the correct password sets the admin session cookie and keeps access when reloading `/admin`.
3. **Logout clears access** – activating the “Sign out” button calls the session endpoint, removes the cookie, and redirects to the login screen. Navigating back to `/admin` should now redirect to `/admin/login`.

