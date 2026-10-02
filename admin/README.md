# Admin quick reference

Use the [complete user guide](../README.md) for setup, daily tasks, email, passwords, backups, and troubleshooting.

## Start and sign in

From the main `early_childhood` folder:

```bash
npm run local
```

Admin: http://localhost:4175  
Website: http://localhost:4174

Keep Terminal open; Control+C stops the project.

The Terminal banner identifies version **2.1.2**. Root launch commands create `admin/.env` from `.env.example` if it is missing, while preserving an existing file. The included `server/tsconfig.json` fixes Node type resolution in the editor; after installing packages, restart VS Code's TypeScript server if an old error remains.

On a fresh installation, log in with **Admin** / **Admin@123**. The account is assigned in `server/initial-admin.ts` and initialized once. There is no Create account page. Existing accounts and changed passwords are preserved.

If the entrance says **Signed in as**, the browser already has an active session. Select **Log out** there to display the login form again, or **Open admin panel** to continue.

Access tokens last 15 minutes and renew automatically using a rotating refresh token within a seven-day session. Set `ADMIN_ACCESS_TOKEN_MINUTES` and `ADMIN_REFRESH_TOKEN_DAYS` in `admin/.env`, restart, then log out and sign in to change these durations. Refreshing does not extend the maximum time from login. The token upgrade requires a new login while preserving the account and school data. See the [token guide](../README.md#access-and-refresh-tokens).

Set your own password using the guide's change-password or Terminal recovery instructions. Optional private `ADMIN_INITIAL_USERNAME` and `ADMIN_INITIAL_PASSWORD` values apply only before the first account is initialized.

## Admin sections

| Section | Main actions |
| --- | --- |
| Quick Actions | Dashboard, counts, recent applications, and content shortcuts. |
| Admissions | Review applications, add notes, and update decisions. |
| Staff & Teachers | Manage Admins, Teachers, Operators, photos, and Active/Inactive status. |
| Reviews | Approve, hide, or remove parent reviews. |
| Programs | Manage descriptions, ages, fees, and Published/Draft status. |
| Gallery | Add/replace photos and filter by category, status, or search. |
| Events | Manage dates, locations, details, categories, and status. |
| Blog | Manage articles, introductions, photos, categories, and status. |
| Settings | School details, email queue counts, retries, and password changes. |

The Messages page is removed. Reply to contact enquiries from the school inbox. Admission decision changes do not send automatic decision emails. Staff profiles do not create login accounts.

Only Active staff, Published content, and Approved reviews appear publicly. Gallery, Events, and Blog support New category in the toolbar and editor. Photos accept JPEG, PNG, or WebP up to 8 MB.

## Email and recovery

Use `.env.example` to create `admin/.env` if it does not exist. Preserve an existing configuration when updating. Fill in SMTP values and `ADMIN_RECOVERY_EMAIL`, then restart from the main folder.

The root launcher creates that file automatically on the first run. Access/refresh-token code is in `server/auth.ts` and `src/auth.ts`; `.env` only configures durations and other settings. To use a three-day maximum login, set `ADMIN_REFRESH_TOKEN_DAYS=3`, restart, and sign in again.

School email in Settings receives notifications. Password codes go to the stored recovery address or the `.env` fallback. Existing stored recovery addresses take precedence.

Settings → Change password requires the current password and an emailed code. Forgot Password resets with an emailed code. Both need working SMTP.

For owner recovery without email, stop the server. From the main folder:

```bash
cd admin
npm run reset-password
```

Follow the prompts, then run `cd ..` and `npm run local`.

## Preserve data

Stop the server before copying the **whole `admin/data/` folder**, `.env`, and source assets. Preserve a custom `ADMIN_DATA_DIR` if configured. Keep private data and credentials out of GitHub.

See [backup and update instructions](../README.md#backups-and-project-updates).

## Styles and uploaded photos

The admin loads `src/styles.css` for all its styling, fonts, and component variants. Staff photos, gallery cards, and upload previews preserve image proportions and fill their frames. New uploads use the same styling automatically. The website styling is in `../website/src/styles.css`.
