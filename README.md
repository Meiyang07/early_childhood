# Early Childhood Montessori

Source code for the public Montessori website and the independent local admin panel. Both applications are included in this repository.

## Requirements

Use Node.js 24. npm comes with Node.js; pnpm is also supported. Run each application from its own folder.

## Public website

```bash
cd website
npm install
npm run dev
```

Open the local URL shown by Vite in Terminal. Build with `npm run build`.

## Local admin

In another Terminal window:

```bash
cd admin
npm install
npm run local
```

Open http://localhost:4175 and create your admin username and password on first launch. Usernames use letters, numbers, dots, underscores, and hyphens, without spaces or `@`. Keep Terminal open while using the panel.

The admin database and uploaded photos are created in `admin/data/`. That folder and environment files are excluded from Git. Read `admin/README.md` for editing, backups, and password resets.

## Current scope

This package contains the last working versions before the requested integration was stopped. The public website and admin run separately. The public contact and enrollment forms open email drafts; the admin saves its own records locally. Public-to-admin synchronization has not been added.

## Upload this code to GitHub

Create an empty repository on GitHub, then open Terminal in this root folder and run:

```bash
git init -b main
git add .
git commit -m "Add Early Childhood website and local admin"
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_REPOSITORY_URL` with the HTTPS or SSH URL of your new GitHub repository. Do not initialize the GitHub repository with a README because this package already includes one.

No installed dependencies, build outputs, accounts, private database, or passwords are included in this source package.
