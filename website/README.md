# School website quick reference

Use the [complete user guide](../README.md) for setup, admin tasks, email, passwords, backups, and troubleshooting.

## Start

From the main `early_childhood` folder:

```bash
npm run local
```

Website: http://localhost:4174  
Admin: http://localhost:4175

Keep the server running and keep `website`, `admin`, and `shared` together. Visitors do not need an admin login.

## Pages

| Page | Path |
| --- | --- |
| Home | `/` |
| About | `/about` |
| Programs | `/programs` |
| Admissions | `/admissions` |
| Enrollment | `/enroll` |
| Admins, Teachers, and Operators | `/team` |
| Gallery | `/gallery` |
| Events | `/events` |
| Blog | `/blog` |
| Contact | `/contact` |
| Parent Reviews | `/reviews` |

Applications are saved in Admin → Admissions. Contact notifications go to the school inbox. Reviews appear after approval.

Phone fields display Nepal's +977 prefix and require ten digits after it. The school landline is 061-552290.

## Connected content

Use admin to manage staff, programs and tuition, gallery, events, blog, reviews, and connected school settings. Only Active staff, Published content, and Approved reviews appear publicly. Public changes update open pages through the shared server.

Gallery categories appear publicly when they contain published photos. Click a photo to open the full viewer. Previous/Next and arrow keys navigate; Close, Escape, and the backdrop close it.

Original images are in `public/assets/`. Uploaded photos are served from the private data directory through the media API when their attached content is public. Preserve the whole data folder when updating or moving the project.

## Development

From the main folder:

```bash
npm run dev
```

Website development: http://localhost:5174  
Admin development: http://localhost:5175

`src/SchoolContext.tsx` loads public content and listens for live changes. Static wording, home-page media, partner logos, map location, and layout styles are edited in source and assets.

The connected backend is required for content and forms. Deploying only static files does not provide the complete application.
