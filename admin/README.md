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

On a fresh installation, log in with **admin** / **EarlyChildhood@2026**. The account is assigned in `server/initial-admin.ts` and initialized once. There is no Create account page. Existing accounts and changed passwords are preserved.

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
