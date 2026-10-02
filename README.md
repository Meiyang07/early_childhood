# early_childhood — Website and Admin User Guide

Early Childhood Montessori's website and admin panel run together on your computer. The admin manages school content, admissions, and parent reviews. Published changes update the website while it is open.

**Repository:** `early_childhood`  
**Version:** `2.1.2`  
**Last updated:** 2 October 2026

For a short installation checklist, open [START_HERE.md](START_HERE.md). This full project includes the website, admin server, access/refresh-token code, bundled images, and the server editor configuration.

## Quick start

Updating an existing project? Follow [Backups and project updates](#backups-and-project-updates) first. Your account and uploaded photos depend on the saved data folder.

1. Install **Node.js 24** from the [official download page](https://nodejs.org/en/download). The minimum supported version is **22.13.0**.
2. Extract the project ZIP, or open your cloned `early_childhood` repository.
3. Open Terminal in the folder containing this README, `package.json`, `admin`, and `website`.
4. Run:

```bash
npm run local
```

5. Wait for installation and building to finish, then open:

The Terminal banner starts with **Early Childhood 2.1.2** so you can confirm that you opened this updated folder. On the first run, the launcher creates `admin/.env` from the included example if it is missing. An existing `.env` is preserved. The initial values use 15-minute access tokens and a seven-day maximum login session; email settings remain blank until you configure them.

| App | Address | Purpose |
| --- | --- | --- |
| School website | http://localhost:4174 | Browse school information, apply, submit reviews, and contact the school. |
| Admin panel | http://localhost:4175 | Sign in and manage school content. |

On a **fresh installation**, sign in with:

| Field | Starter value |
| --- | --- |
| Username | `Admin` |
| Password | `Admin@123` |

The admin opens directly to **Log in**. There is no Create account page. The starter account is assigned in `admin/server/initial-admin.ts` and created automatically before the server opens.

**Existing installations keep their current username and password.** Changing the password is permanent; restarting does not reset it to the starter password.

The starter credentials are shared with this source package. Set your own password before using the installation on a shared computer or deploying it. Use [Passwords and recovery](#passwords-and-recovery); local Terminal recovery works when SMTP is not configured.

Keep Terminal open while using the project. Press **Control+C** to stop both apps. To start again, run `npm run local` from the same folder.

On macOS, you can also double-click `RUN_LOCAL.command`. On Windows, use `RUN_LOCAL.cmd`. If a launcher does not open, use the Terminal command above.

## Contents

- [Installation and daily use](#installation-and-daily-use)
- [Admin account and login](#admin-account-and-login)
- [Using the school website](#using-the-school-website)
- [Admin dashboard](#admin-dashboard)
- [Common admin actions](#common-admin-actions)
- [Admissions](#admissions)
- [Staff and teachers](#staff-and-teachers)
- [Programs and tuition](#programs-and-tuition)
- [Gallery and photos](#gallery-and-photos)
- [Events and blog](#events-and-blog)
- [Creating categories](#creating-categories)
- [Parent reviews](#parent-reviews)
- [School settings](#school-settings)
- [School enquiries and email](#school-enquiries-and-email)
- [Passwords and recovery](#passwords-and-recovery)
- [Backups and project updates](#backups-and-project-updates)
- [Troubleshooting](#troubleshooting)
- [Development and GitHub](#development-and-github)
- [Current limits](#current-limits)
- [Useful documentation](#useful-documentation)

## Installation and daily use

### Check Node.js and npm

Run:

```bash
node --version
npm --version
```

Node.js must be version 22.13.0 or newer. This project has been checked with Node.js 24. npm is the package manager used by the included launch scripts.

If a command is not found, install Node.js, close Terminal, and open it again.

### Find the correct folder

| Item | What it contains |
| --- | --- |
| `package.json` | Commands for the complete project. |
| `README.md` | This guide. |
| `admin/` | Admin interface, server, email configuration, and saved data. |
| `website/` | School website and original images. |
| `shared/` | Shared live-update code. |
| `scripts/` | Installation, build, and startup scripts. |

On a Mac, type `cd ` in Terminal, drag the extracted project folder into Terminal, and press Enter. Then run `npm run local`.

Run the main commands from this folder. The launcher installs dependencies from the npm lockfiles when needed, builds both apps, and starts their server. First-time dependency downloads need internet access. Email delivery also needs a connection to the provider.

### Daily use

1. Open Terminal in the main folder and run `npm run local`.
2. Open the website and admin addresses.
3. Sign in when you need to manage the school.
4. Save your changes before finishing.
5. Press Control+C in Terminal to stop the project.

`localhost` refers to the computer running the server. Opening the same address on a different computer or phone does not open this installation.

## Admin account and login

### Sign in and out

Open http://localhost:4175, enter your username and password, and select **Log in**. Use the eye button to show or hide the password while typing.

On a fresh data folder, the code-defined credentials are `Admin` / `Admin@123`. On an existing data folder, use the account already saved there. There are no registration or account-creation controls.

If the entrance says **Signed in as**, your browser still has a valid session. Select **Open admin panel** to continue, or **Log out** on that screen to show the username and password fields again. You can also use **Log out** at the bottom of the dashboard sidebar when finished. **Admin display name** in Settings changes the greeting and account label, while keeping the login username unchanged.

The app provides one local admin account. Adding people under Staff & Teachers creates public staff profiles, not additional login accounts.

### Access and refresh tokens

Login issues two opaque tokens in HttpOnly, SameSite=Strict cookies. The access token authorizes admin API requests for 15 minutes. The refresh token renews access automatically within a seven-day session. Token hashes are kept in SQLite; raw tokens are not returned in JSON or placed in browser storage.

Each refresh replaces the refresh token. Reusing an already-consumed refresh token revokes that session. The client coordinates refresh requests within a tab and, in browsers with the Web Locks API, across tabs. Forms, uploads, and the admin event stream use automatic renewal. Public website requests do not use admin tokens.

The seven-day limit is counted from login and is not extended by refreshing. When it ends, sign in again. Logout revokes that browser's whole token session. Password resets revoke all token sessions; a verified password change replaces the current session and revokes the others. Password verification is bound to the stable session ID so access-token rotation does not invalidate its code.

After expiry, the next protected request or live-session check returns the admin to login. An idle entrance page may continue showing its previous account label until it next checks the session; expired tokens cannot authorize admin requests.

The implementation is in these files:

| File | Purpose |
| --- | --- |
| `admin/server/auth.ts` | Token creation, cookie handling, renewal, and logout. |
| `admin/server/store.ts` | Hashed tokens, session expiry, rotation, and revocation. |
| `admin/server/index.ts` | Login, refresh, logout, and protected API routes. |
| `admin/src/auth.ts` | Automatic renewal, request retry, and coordination across tabs. |
| `admin/server/config.ts` | Cookie names, durations, and configuration validation. |

These files are already connected to the admin forms, uploads, and live updates. Tokens are generated on login; there is no fixed access or refresh token to paste into `.env`.

To change the durations, add or edit these in `admin/.env`:

```env
ADMIN_ACCESS_TOKEN_MINUTES=15
ADMIN_REFRESH_TOKEN_DAYS=7
ADMIN_SECURE_COOKIES=false
```

The defaults are defined in `admin/server/config.ts`. Access duration accepts 1–60 minutes. The refresh duration must be longer than access duration, and cannot exceed 30 days. Save, restart `npm run local`, log out, and sign in to receive tokens with the new durations. Preserve other existing `.env` values.

For a three-day maximum session, set `ADMIN_REFRESH_TOKEN_DAYS=3`. The `.env` file is inside `admin/`, next to `package.json`. The root launch commands create it when missing; after editing it, restart and sign in again.

This package serves local HTTP; `ADMIN_SECURE_COOKIES=false` supports that setup. Set it to `true` when serving an HTTPS installation. Use a current browser for cross-tab locking. Without Web Locks, only requests within the same tab are coordinated; simultaneous refreshes from separate tabs may require a fresh login.

The token upgrade runs a database migration and requires one new login. Existing usernames, passwords, school records, and uploads remain saved. Back up before upgrading; an older server cannot open the upgraded database.

### Configure a new installation's credentials

The starter values are assigned in `admin/server/initial-admin.ts`. For private first-run values without changing shared source, set these in `admin/.env` **before starting a fresh installation**:

```env
ADMIN_INITIAL_USERNAME=your-chosen-username
ADMIN_INITIAL_PASSWORD=your-own-password
ADMIN_RECOVERY_EMAIL=your-recovery-address@example.com
```

Replace the example values with your actual choices. Usernames can be any nonblank string up to 120 characters; spaces, symbols, Unicode, and email-style names are supported. Outer spaces are trimmed and login is case-insensitive. Passwords must contain 8–128 characters and are case-sensitive.

Initial credentials apply only when no admin account exists. Editing the code defaults or these initial variables does not replace an existing account's password. Use the password-change or recovery instructions for an existing account.

Passwords are hashed in the private database. Keep `.env` out of GitHub.

## Using the school website

Open http://localhost:4174. Parents and visitors can browse without an admin account.

| Page | Path | How to use it |
| --- | --- | --- |
| Home | `/` | View the school introduction, published programs, and approved testimonials. |
| About | `/about` | Read the school background and Montessori approach. |
| Programs | `/programs` | View published program details. |
| Admissions | `/admissions` | Read admission information and program age ranges. |
| Enrollment | `/enroll` | Submit an application. |
| Team | `/team` | Switch between Admins, Teachers, and Operators to view active profiles. |
| Gallery | `/gallery` | Filter photos and click one to open the full image. |
| Events | `/events` | View published school events. |
| Blog | `/blog` | Select Read Article to open a complete article. |
| Contact | `/contact` | View contact information and submit an enquiry. |
| Parent Reviews | `/reviews` | Read approved reviews and submit one for moderation. |

### Submit an application

1. Open **Enroll Your Child**.
2. Complete the child's information and select a program.
3. Enter the parent or guardian's name, phone, email, and address.
4. Add any relevant additional information.
5. Select **Submit Application** and wait for confirmation.
6. If an error appears, correct the highlighted fields and try again.

The application is saved under **Admin → Admissions** with Pending status. An email notification is queued for the school inbox.

### Contact the school

On the Contact page, enter your name, phone, email, and message. Select the send button and wait for confirmation. The enquiry is saved and its notification is queued for the school email.

### Phone numbers

Parent and contact phone fields display Nepal's **+977** prefix. Enter exactly **10 digits** after it, without spaces or another country code. A format example is `9801234567`, entered without `+977` in the field.

The separate school landline is **061-552290**, with dialing link `tel:+97761552290`.

## Admin dashboard

The sidebar's **Quick Actions** link opens the dashboard.

| Item | Meaning |
| --- | --- |
| New Admissions | Admission records dated in the current month. |
| Students | Admission records with Approved status. |
| Team Members | Staff profiles with Active status. |
| Upcoming Events | Published events dated today or later. |
| Recent Admissions | Latest applications; select a name to review it. |
| Quick Actions | Add a team member, create an event, or create a blog post. |
| Workspace Content | Counts of programs, staff profiles, gallery items, and upcoming events. |
| Admin Controls | Shortcuts to staff, reviews, gallery, and admissions. |

The footer's **Online** indicator shows the live-update connection. **Reconnecting…** means it is trying to reconnect.

The Messages page and its navigation shortcuts have been removed. Handle contact enquiries from the school email inbox.

## Common admin actions

### Search and filter

Search using the field at the top of a section. Choose a status to narrow results. Staff has team tabs; Gallery, Events, and Blog also have category filters.

Filters combine. If a record seems missing, clear the search and select **All statuses**, **All categories**, or **All**, as appropriate. **Clear filters** appears when a filtered section has no matching records. Use the refresh button to reload records.

### Add, edit, or remove

1. Open the section and select its **Add** button.
2. Complete required fields marked `*`.
3. Choose the status and attach a photo when needed.
4. Select the form's Add button and wait for confirmation.

Use the pencil button to edit a record, then **Save changes**. In table sections, selecting its name also opens the editor.

Use the trash button and confirm **Remove record** to delete an entry. There is no in-app undo. Use Draft, Inactive, or Hide when you only want to stop showing content publicly.

If a record changes in another session while you are editing, keep a copy of unsaved text, close the editor, refresh, and reopen it before saving.

### Public visibility

| Content | Public status |
| --- | --- |
| Staff | Active |
| Programs, gallery photos, events, and blog posts | Published |
| Parent reviews | Approved |
| Admissions and contact enquiries | Private; never displayed publicly. |

Older records explicitly marked as demo data remain stored and are hidden from both the admin display and the public website.

## Admissions

Open **Admissions** to review submitted applications or add one manually.

1. Find an applicant using search or the status filter.
2. Select the name or pencil button.
3. Review the program, date, child details, guardian, and contact information.
4. Use **Application notes** for internal follow-up information.
5. Set the status and select **Save changes**.

| Status | Suggested use |
| --- | --- |
| Pending | Newly received application. |
| Review | Being assessed or awaiting follow-up. |
| Approved | Accepted application; included in the Students count. |
| Declined | Application not accepted. |

Application details and notes stay private. Changing a status does not automatically send a decision email. Contact the guardian separately using their saved email or phone number.

## Staff and teachers

Open **Staff & Teachers**. Use All, Admins, Teachers, and Operators to find profiles.

1. Select **Add team member**, or **Add Team Member** on the dashboard.
2. Enter the full name, choose the Team, and enter the Role.
3. Add a description under **About this member**, if needed.
4. Choose a profile photo.
5. Select Active for public display or Inactive to keep it private.
6. Save.

The public Team page uses the same three groups. Profiles without a photo show initials. Edit the Profile photo field to add or replace a missing photo.

Keep the `admin` and `website` folders together. Original staff photos are included in the assets and do not need to be uploaded again.

## Programs and tuition

Open **Programs**, then add or edit a program.

| Field | What to enter |
| --- | --- |
| Program name | The name parents should see. |
| Age group | The intended age range. |
| Monthly fee | A number in Nepalese rupees, without currency symbols or separators. |
| Description | Program information. |
| Class duration | The displayed schedule or duration text. |
| Number of teachers | Displayed teacher count. |
| Number of children | Displayed capacity. |
| Display order | A lower number places the program earlier in public content order. |
| Status | Published for public display; Draft to keep it private. |

Published programs supply program cards, admission age ranges, enrollment choices, and tuition information. Updating a fee updates the connected tuition display.

Consider Draft before deleting a program. Historical applications retain their saved program name; new application forms offer currently published programs.

## Gallery and photos

### Add or replace a photo

1. Open **Gallery** and select **Add photo**.
2. Enter the Photo title and choose a Category.
3. Enter an Image description that describes the photo.
4. Choose a file and check the preview.
5. Choose Published or Draft, then select **Add photo**.

To replace a photo, open the pencil editor, select another file, and save. Use search, category, and status filters together to find photos.

Photos must be **JPEG, PNG, or WebP**, up to **8 MB**. Gallery photos are required. Staff and blog photos are optional.

### Public photo viewer

Open the website Gallery, select a category or All, and click a photo.

| Control | Action |
| --- | --- |
| Previous / Next buttons | Move through photos in the current selection. |
| Left / Right arrow keys | Move to the previous or next photo. |
| Close button or Escape | Close the viewer. |
| Click outside the viewer | Close it. |

The viewer works on mobile too. A custom category appears publicly once it contains a published photo. Empty categories remain available in the admin.

## Events and blog

### Events

1. Open **Events → Add event**, or **Create Event** on the dashboard.
2. Enter the title, date, time, category, location, and details.
3. Choose the status and save.

Published events appear on the website. Draft and Cancelled events are hidden. Published events dated today or later contribute to the Upcoming Events count. Past published events can still appear on the Events page; change their status if you want to hide them.

### Blog

1. Open **Blog → Add blog post**, or **Create Blog** on the dashboard.
2. Enter the title, date, author, and category.
3. Write the Short introduction for the card preview.
4. Write the complete Article as plain text.
5. Add a photo if needed, choose Published or Draft, and save.

**Read Article** opens the full published article. A post without a photo uses the default school campus image.

Review the dates and details of supplied older events and articles before using them as current school announcements.

## Creating categories

Gallery, Events, and Blog have separate category lists.

**From the toolbar:** open the section, select New category, enter a name, and select Create category. The new category becomes the selected filter. Add content to it if the result is empty.

**Inside an editor:** select New category next to Category, enter a name, and select Create category. Finish the record and save.

Names can contain up to 80 characters. Commas are not allowed and **All** is reserved. Capitalization and extra spaces do not create duplicates of an existing category.

Categories remain after their last record is removed and after restarting. The interface supports creating categories, but does not rename or delete them. Public Gallery tabs appear only for categories with published photos.

## Parent reviews

Parents submit reviews on the public Reviews page. New reviews have Pending status.

1. Open **Reviews** in the admin and read the name, rating, and feedback.
2. Select **Approve** to publish a review.
3. Select **Hide** on an approved review to stop showing it publicly.
4. Use the trash button and confirm removal when a review must be deleted.

Approved reviews appear on the public Reviews page. The home page also shows a selection of approved testimonials.

Admins cannot add reviews or rewrite a parent's name, rating, or feedback. The controls are Approve, Hide, and Remove.

## School settings

Open **Settings**, edit the available fields, and select **Save settings**.

| Setting | Effect |
| --- | --- |
| School name | Updates connected brand labels and email notifications. Some page headings remain static website copy. |
| Admin display name | Updates the greeting and account label; login username stays unchanged. |
| School email | Sets the public email and inbox receiving enquiry and application notifications. |
| School landline | Read-only: 061-552290. |
| Address | Updates the connected address text. |
| Working days | Updates the connected office-day display. |
| Opening / Closing time | Updates working hours. Closing must be after opening time. |

Defaults are **Monday–Friday, 9:00 AM–4:00 PM**. Restoring existing data keeps your saved settings.

The account panel shows your username and recovery email and provides Change password. The email-delivery panel shows configuration status, pending/failed counts, and a retry button.

## School enquiries and email

Contact enquiries are handled from the **school email inbox**. There is no admin Messages page. A private copy of each enquiry remains saved.

Setting School email alone does not configure delivery. SMTP details from your email provider are required.

### Configure SMTP

1. If `admin/.env` does not exist, duplicate `admin/.env.example` and name the copy `.env` inside `admin/`.
2. If `.env` already exists, edit it and preserve its existing settings.
3. Open it in a text editor. On a Mac, Command+Shift+. in Finder shows hidden files.
4. Fill in the empty SMTP values using your provider's details:

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

| Variable | Value |
| --- | --- |
| `SMTP_HOST` | Provider's SMTP hostname. |
| `SMTP_PORT` | Provider's SMTP port. |
| `SMTP_SECURE` | `false` for STARTTLS on 587; `true` for TLS on 465. |
| `SMTP_USER` | SMTP account username, often a mailbox address. |
| `SMTP_PASS` | Provider-issued SMTP password or app password. |
| `SMTP_FROM` | A sender address authorized for that SMTP account. |

Use your provider's supported settings. With `SMTP_SECURE=false`, this app requires STARTTLS. See [Nodemailer SMTP settings](https://nodemailer.com/smtp).

5. Set **Admin → Settings → School email** to the inbox receiving enquiries and applications, then save.
6. Stop the project with Control+C and restart `npm run local` after editing `.env`.

### Which email address does what?

| Address | Purpose | Set it here |
| --- | --- | --- |
| School email | Receives enquiries and application notifications; displayed publicly. | Admin Settings. |
| SMTP sender | Sends notifications and password codes. | `SMTP_FROM` in `admin/.env`. |
| Admin recovery email | Receives password verification codes. | `ADMIN_RECOVERY_EMAIL` in `.env` for accounts without a stored recovery address. Existing stored addresses take precedence. |

### Check delivery and reply

Send a Contact-page test enquiry using your own details. Check the school inbox and **Settings → Email delivery**.

**Email available** means the required configuration fields are present. Delivery still depends on valid credentials and the provider accepting the email. The panel shows pending and failed notification counts.

Forms remain saved when email is unavailable; notifications stay in a durable queue. After correcting SMTP and restarting, select **Retry pending emails**. The server also processes queued notifications automatically while running. Repeated failures can mark a notification Failed.

Reply to a notification from the school inbox. Its Reply-To address is the visitor or guardian who submitted the form. Check spam folders when mail is missing; SMTP acceptance does not guarantee inbox placement.

Keep `.env` private because it contains email credentials.

## Passwords and recovery

### Change your password

1. Open **Settings → Change password**.
2. Enter the current password and select **Email verification code**.
3. Copy the six-digit code from the recovery inbox.
4. Enter the code, new password, and confirmation.
5. Select **Verify & change password**.

Your current session stays signed in; other sessions are signed out. The new password stays saved after restarts.

### Forgot Password

1. Open the admin login page and select **Forgot Password?**.
2. Enter the username and select Email verification code.
3. Enter the emailed code and the new password twice.
4. Select **Verify & reset password**, then log in again.

A reset signs out existing sessions. Codes expire after ten minutes, work once, and allow at most five incorrect attempts. Wait at least one minute before requesting another. Restarting the server invalidates outstanding codes.

### Set the recovery destination

For the code-created starter account, set this in `admin/.env` and restart:

```env
ADMIN_RECOVERY_EMAIL=your-recovery-address@example.com
```

Replace the example with an inbox you can access. If the account already has a saved recovery address from an older installation, that address takes precedence. Changing School email does not change the recovery destination; the interface has no recovery-email editing field.

SMTP must work for email password verification. Codes are sent directly, without waiting in the notification queue.

### Local recovery without email

If you own the installation and can access its files:

1. Stop the server.
2. From the main project folder, run:

```bash
cd admin
npm run reset-password
```

3. Enter the existing admin username, new password, and confirmation when prompted. Password input is hidden.
4. Return to the main folder and restart:

```bash
cd ..
npm run local
```

The command needs an interactive Terminal and installed admin dependencies. It changes the password and signs out old sessions while preserving school records.

## Backups and project updates

### Preserve these items

| Item | Contents |
| --- | --- |
| Entire `admin/data/` folder | Account, settings, school records, submissions, categories, email queue, and uploaded photos. |
| `admin/.env` | SMTP credentials, optional ports, recovery address, and custom data path. |
| Source and original assets | Files needed to rebuild the site, including bundled images. |

Uploaded photos are in `admin/data/uploads/`; the database is `admin/data/admin.sqlite`. Copy the **whole data folder**, including any additional database files present.

If you set `ADMIN_DATA_DIR`, preserve that configured folder instead. Relative paths are resolved from `admin/`. Keep its matching configuration when moving the project.

### Back up

1. Save your changes and stop the server.
2. Create a dated backup folder outside your Git repository.
3. Copy the full data folder, `.env` if present, and project source/assets.
4. Store the backup privately and separately from the working folder.

### Update from a ZIP

1. Back up the old installation while its server is stopped.
2. Extract the new ZIP into a separate folder.
3. Copy old `admin/data/` into the new `admin/`, or preserve your custom data directory.
4. Copy the existing `admin/.env` into the new `admin/`.
5. From the new main folder, run `npm run local`.
6. Sign in with your existing credentials and check staff, gallery, admissions, and settings.

Supported database upgrades run automatically. The access/refresh-token version uses schema 4 and retires legacy session cookies, so sign in again after installing it. Keep the backup until the updated version is checked. Dependencies and build folders are regenerated and do not need to be copied.

The distributed ZIP includes source and bundled assets, but excludes private data and `.env`. A fresh data folder receives the starter account; a restored data folder keeps its existing account.

The launcher creates a default `.env` only when one is missing. Copy your old configuration before starting the updated project to keep your email settings and custom data path.

### Restore

Stop the server. Keep the current installation as a separate copy, then restore the backed-up project, data, and matching `.env`. Start it and check your records. Restoring returns records to their state at the backup time.

Do not run two project copies against the same data folder while updating or restoring.

## Troubleshooting

| Problem | What to do |
| --- | --- |
| `npm` or `node` not found | Install Node.js and reopen Terminal. Check both version commands. |
| `ENOENT` or missing `package.json` | Run from the main project folder containing `package.json`. |
| Token files cannot be found | Open the folder extracted from this updated full ZIP. Both `admin/server/auth.ts` and `admin/src/auth.ts` must be present. Check for the 2.1.2 Terminal banner. |
| VS Code says `Cannot find name 'process'` | Run `npm run setup`, then use Command Palette → TypeScript: Restart TS Server. The included `admin/server/tsconfig.json` selects the Node server configuration. |
| Unsupported Node.js or `node:sqlite` error | Use Node.js 24, or at least 22.13.0. |
| Installation fails | Check internet access and the Terminal error. Keep the lockfiles and retry. |
| Browser cannot connect | Confirm the server is running and use the printed address. Restart if it stopped. |
| Port already in use | Stop the other project copy with Control+C, or choose unused ports in `.env` and restart. |
| Old interface remains after an update | Stop the old server and run `npm run local` from the updated folder to rebuild. Refresh the browser. |
| Starter credentials do not work | An existing account or first-run overrides may be present. Use the saved username/password or recovery; do not delete data to reset an account. |
| Account or records seem missing after an update | Check the preserved data directory and `ADMIN_DATA_DIR` before editing records. |
| Too many login attempts | Wait for the temporary block to expire, then retry with the correct saved credentials. |
| Images missing | Keep original assets and the project folders together. Restore uploaded images with the complete data folder. Check the record's photo and public status. |
| Content exists in admin but not publicly | Check Active, Published, or Approved status and clear relevant filters. |
| New gallery category missing publicly | Publish a photo in that category. |
| Record missing in admin | Clear search, status, category, and team filters; refresh records. |
| Live changes not appearing | Save, check public status, confirm the server is running, and reload the website. |
| Email unavailable | Configure valid SMTP values and restart. Check School email. |
| Email available but no mail arrives | Check credentials, sender authorization, port/TLS settings, queue counts, and spam folders. Correct, restart, then retry notifications. |
| Verification code missing | Check SMTP and the recovery destination shown in Settings. Check spam; wait a minute before requesting again. |
| Invalid or expired code | Request a fresh code and use it within ten minutes. Request another after a server restart. |
| Record changed in another session | Keep a copy of unsaved text, close the editor, refresh, and reopen. |
| School phone cannot be edited | It is fixed at 061-552290. Contact/guardian mobile fields accept ten digits. |
| Messages page not found | It was removed; reply to enquiries from the school inbox. |

## Development and GitHub

### Commands

Run from the main folder:

| Command | Purpose |
| --- | --- |
| `npm run local` | Install dependencies when needed, build both apps, and start the local project. |
| `npm run setup` | Install locked dependencies without starting. |
| `npm run dev` | Start the backend and both Vite development interfaces. |
| `npm run build` | Install dependencies when needed, type-check, and build both apps. |
| `npm --prefix admin start` | Start using existing builds and `admin/.env`; build first. |

| App | Development address |
| --- | --- |
| Website | http://localhost:5174 |
| Admin | http://localhost:5175 |

Both modes use the same configured data directory and backend ports. Start one mode at a time. Vite updates React edits while running; backend TypeScript changes require restarting development mode.

### Optional local configuration

```env
ADMIN_PORT=4175
ADMIN_UI_PORT=5175
WEBSITE_PORT=4174
WEBSITE_UI_PORT=5174
ADMIN_DATA_DIR=data
```

If changing ports, choose separate unused ports and use the corresponding addresses. Preserve the data path when upgrading.

### Source locations

| Path | Contents |
| --- | --- |
| `website/src/` | Public pages, layout, styles, and gallery viewer. |
| `website/public/assets/` | Original school, gallery, staff, and blog images. |
| `admin/src/` | Admin interface, forms, filters, and record definitions. |
| `admin/server/` | Server, SQLite, uploads, email, authentication, and initial account settings. |
| `admin/public/` | Admin static assets. |
| `shared/live.ts` | Shared live-update handling. |
| `scripts/` | Installation, startup, and build coordination. |
| `admin/.env.example` | Configuration template without private credentials. |

The main technologies are React, TypeScript, Vite, Node.js, SQLite, and Nodemailer. Admin styling uses Tailwind CSS and Radix UI.

Staff, programs, gallery, events, blog, review moderation, and connected school details are managed in admin. Static wording, home-page media, partner logos, map location, and layout styles are edited in the website source and assets.

### GitHub repository

The repository is **early_childhood**. Replace `YOUR_GITHUB_USERNAME` with the repository owner's username:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/early_childhood.git
cd early_childhood
```

If it starts empty, copy the extracted project's contents into the cloned folder so `package.json` is directly inside it. Keep the project folders together, then run `npm run local`.

Review `git status` before committing. The included `.gitignore` excludes default private data, environment files, dependencies, and builds. A custom data directory inside the repository needs its own ignore entry; keeping it outside avoids that issue.

For a documentation-only commit:

```bash
git status
git add README.md admin/README.md website/README.md
git commit -m "Update website and admin user guide"
git push
```

GitHub stores the source. This connected application needs a running Node.js server and persistent data; GitHub Pages alone cannot run its backend.

## Current limits

- Both apps are configured for local use. Public hosting requires domain, HTTPS, server, email, and persistent-storage configuration.
- One local admin account is supported. Staff groups are profile categories.
- Starter credentials are shared defaults; use private first-run overrides or change the password for your installation.
- Contact enquiries are handled from email; there is no admin Messages page.
- Admission decisions do not trigger automatic decision emails.
- Categories can be added and selected, without rename/delete controls.
- Reviews support moderation without admin Add or Edit controls.
- Recovery email, home media, partner logos, map location, and some wording are not editable through Settings.
- Automated backups, payments, and attendance management are not included.

## Useful documentation

- [Node.js downloads](https://nodejs.org/en/download)
- [Nodemailer SMTP settings](https://nodemailer.com/smtp)
- [GitHub: cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
- [Admin quick reference](admin/README.md)
- [Website quick reference](website/README.md)

## Styling and image fitting

All website styles are in `website/src/styles.css`. All admin styles, local font declarations, and component variants are in `admin/src/styles.css`. Each app imports only its `styles.css`; separate animation, article, connection, and image fitting stylesheets are merged into it.

Photo cards, profile frames, article headers, and upload previews use proportional image fitting. Photos fill their frames without distortion, which can crop their edges when the frame and photo have different shapes. Logos and the full gallery viewer use `contain` so the whole image remains visible. These styles apply automatically to new admin uploads; uploaded originals are preserved.

The article dialog opens above the animated page. Opening it locks page scrolling; its photo and close button remain fixed while only the article text scrolls. Close it with the close button, Escape, or the backdrop.
