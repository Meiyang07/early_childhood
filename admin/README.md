# Early Childhood Admin — Local Project

A standalone React + TypeScript admin panel based on your login and dashboard images. It runs on your own computer at **http://localhost:4175**, independently of the public Early Childhood website.

## Run on your Mac

1. Install **Node.js 24 LTS** if needed (Node.js 22.13 or newer is required).
2. Unzip this project and open Terminal in the `early-childhood-admin-local` folder.
3. Run:

```bash
pnpm install
pnpm local
```

If you do not have pnpm, these commands also work:

```bash
npm install
npm run local
```

Open **http://localhost:4175**. The first screen asks you to choose your own admin username and password. No default credentials are supplied. Later visits use that same local account.

On macOS, `RUN_LOCAL.command` is also included. It installs missing dependencies, builds the project, starts the local server, and opens your browser. Terminal commands above are the most reliable option if macOS blocks downloaded command files.

Keep Terminal open while using the panel. Press **Control+C** to stop it. Internet access is needed to install dependencies; after installation, the panel, fonts, photos, and database work locally.

## Editing the project

Stop the normal local server with Control+C before switching to development mode.

```bash
pnpm dev
```

The React development UI opens at **http://localhost:5175** and uses the separate local API at port 4175. Saved records are the same as in normal local mode.

For a manual build/start:

```bash
pnpm build
pnpm start
```

## Login and saved data

- Create your admin account on the first run. Passwords use salted scrypt hashes; sessions use an HTTP-only cookie.
- Change your password in **Settings → Change password**.
- If you forget it, stop the server and run `pnpm reset-password` (or `npm run reset-password`) in the project folder. Enter your admin username and a new password. This keeps your school records and photos and logs out old sessions.
- Your SQLite database is created in **`data/admin.sqlite`**. Uploaded photos are in **`data/uploads/`**.
- To back up or move your records to another computer, stop the server and copy the **entire `data` folder**, then restore it inside the project before starting. Treat the backup as private: it includes school records and password hashes.
- This ZIP starts with no account or personal database. Test credentials and test records are excluded.

The server listens only on your own computer. This package is intended for local use; public hosting would require a separate deployment configuration.

## Included views

Dashboard, admissions, staff and teachers, reviews, messages, programs, gallery, events, blog, and settings. Add, edit, remove, search, filter, update statuses, upload photos, and save school details. Forms validate on both the screen and the server. Removal asks for confirmation; stale edits are rejected instead of overwriting newer data.

The logo, staff portraits, and initial gallery photos use the supplied school assets. Initial admissions from the reference and illustrative messages/reviews are explicitly marked **Example**. Events and blog posts start empty. Deleting an example does not recreate it on the next visit.

Working days default to **Monday–Friday**, with hours **9:00 AM–4:00 PM**. The interface includes animations, mobile layouts, keyboard-accessible controls, and reduced-motion support.

This project has its own login and data. It does not depend on ChatGPT, Sites, Cloudflare, or the previous public website.

## Optional settings

Copy `.env.example` to `.env` to change ports or the data folder. Set `ADMIN_PORT` to change the normal local URL and `ADMIN_UI_PORT` to change the development URL. Restart the project after changing these settings.
