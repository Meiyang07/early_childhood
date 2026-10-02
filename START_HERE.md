# Start the complete Early Childhood project

Version **2.1.2** includes the website, admin panel and backend, access and refresh tokens, bundled photos, and the README user guide.

## Update your existing installation

1. Stop the old server with **Control+C** and back up the old project.
2. Extract this full ZIP into a separate folder.
3. Copy your old **`admin/data/`** and **`admin/.env`** into the new project before starting. Preserve your configured data folder if you use `ADMIN_DATA_DIR`.
4. In VS Code, use **File → Open Folder** and select this extracted `early_childhood` folder. Check that `admin/server/auth.ts` and `admin/src/auth.ts` are present.
5. Open **Terminal → New Terminal** and run:

```bash
npm run local
```

Use Node.js 24; the minimum is 22.13.0. The launcher installs packages and builds both apps. It prints **Early Childhood 2.1.2** so you can confirm that the updated folder is running. An old server must be stopped before starting this one.

## Open the apps

- Website: <http://localhost:4174>
- Admin: <http://localhost:4175>

Use your existing username and password if you copied the data folder. On a fresh installation, the initial login is **Admin** / **Admin@123**. The token upgrade requires a new login and preserves your existing account and school records.

If the entrance says **Signed in as admin**, your browser has an active session. Use **Open admin panel** to continue or **Log out** to show the login form. Other browser profiles and devices must sign in separately. These local addresses refer to the computer running the project.

## Token durations

Access tokens last **15 minutes** and renew automatically within a **seven-day maximum session**. Refreshing does not extend the time measured from login. After expiry, the next protected request or live check requires login again.

The launcher creates **`admin/.env`** when it is missing and keeps any existing file. For the requested seven-day maximum session, edit that file:

```env
ADMIN_ACCESS_TOKEN_MINUTES=15
ADMIN_REFRESH_TOKEN_DAYS=7
ADMIN_SECURE_COOKIES=false
```

Save, restart the server, and log out and sign in again. The token implementation is already connected in `admin/server/auth.ts`, `admin/server/store.ts`, `admin/server/index.ts`, and `admin/src/auth.ts`.

## Editor and email

`admin/server/tsconfig.json` selects the server's Node types. If VS Code still shows `Cannot find name 'process'` after package installation, press **Cmd+Shift+P** and select **TypeScript: Restart TS Server**.

Contact notifications and emailed password codes require your SMTP credentials and recovery email in `admin/.env`. The full [README.md](README.md) explains setup, every admin section, backups, recovery, and GitHub use. Private configuration and saved data are excluded from this ZIP.

## Styles and images

The website uses `website/src/styles.css`; the admin uses `admin/src/styles.css`. Each app loads one stylesheet. Layout, animations, forms, article popup styling, and image fitting are in these files.

Photos fill their frames while preserving their proportions. Some edges can be cropped. Logos and the gallery viewer show the complete image. Existing photos and new admin uploads use the same rules. The article popup keeps the page, image, and close button still while its text scrolls.
