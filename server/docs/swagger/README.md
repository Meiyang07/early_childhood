# Montessori Swagger API documentation

This folder adds documentation only. Existing application code, routes, authentication, dependencies, website animations, and configuration are unchanged.

## Version and source

- Repository: [Meiyang07/early_childhood](https://github.com/Meiyang07/early_childhood)
- Backend revision: [`17fe242d711f00402a20e0e5f2cad3f4a182c2ea`](https://github.com/Meiyang07/early_childhood/commit/17fe242d711f00402a20e0e5f2cad3f4a182c2ea)
- Contract: OpenAPI 3.0.3, 36 registered operations, 9 groups, 50 reusable schemas.
- Sources: `server/src/app.ts`, the eight route files, controllers, validators, models, cookie helpers, upload middleware, and validation/error middleware.

**This is the verified GitHub backend contract. It does not claim to describe the newer ZIP backend.** The ZIP frontend seen in the preceding work uses different public endpoint names. The code workspace was unavailable when this documentation was prepared, so the ZIP backend and a live MongoDB-backed API could not be checked.

## Open the Swagger viewer

From the repository root:

```bash
node server/docs/swagger/serve.mjs
```

Open **http://localhost:8787**. No npm installation or Docker is needed for this viewer. It uses Node built-ins, and downloads pinned Swagger UI 5.11.0 browser assets from unpkg; the browser needs internet access for those assets.

Alternatively, open `index.html` directly in a browser. The OpenAPI definition is embedded, so browsing does not need a running API. The **Download OpenAPI JSON** button exports the contract.

The standalone `openapi.json` file can also be imported into [Swagger Editor](https://editor.swagger.io/).

To use another documentation port:

```bash
SWAGGER_DOCS_PORT=8788 node server/docs/swagger/serve.mjs
```

## Contract checks

```bash
node server/docs/swagger/validate.mjs
```

This dependency-free check verifies JSON structure, local references, operation IDs, path parameters, all registered routes, and authentication/ADMIN metadata against the repository's current route source. It does not call the API, connect to a database, or replace a full OpenAPI-schema validator.

The same pure validation function passed against the inspected source during preparation. The local Node viewer, the Node CLI wrapper, browser rendering, and live requests were not run here because no execution workspace was available.

## Enable request testing locally

The viewer is read-only by default.

1. Start the existing backend normally with its own MongoDB, JWT and Cloudinary configuration.
2. Keep the documentation and API browser hostname consistent: use `localhost` for both.
3. In the existing backend's local environment configuration (`.env.development` in this revision), append `http://localhost:8787` to `CORS_ORIGIN` while retaining existing allowed origins. Restart the backend. This is only needed for testing from the separate documentation port.
4. Open **http://localhost:8787/?try=1** and choose the correct API server URL. `PORT` defaults to 3000.
5. Execute `POST /api/auth/admin-login` with your own existing account. The browser receives HTTP-only cookies.
6. Test authenticated routes from the same browser. Writes marked ADMIN also require the exact role value `ADMIN`.

No requests run automatically. No authentication, CORS, or production configuration was changed by these documentation files. Browser cookie rules still apply; manually entering a cookie value in Swagger's Authorize dialog cannot set an HTTP-only browser cookie.

For command-line testing, use a cookie jar:

```bash
curl -i -c cookies.txt -H 'Content-Type: application/json' \
  -d '{"email":"YOUR_EMAIL","password":"YOUR_PASSWORD"}' \
  http://localhost:3000/api/auth/admin-login

curl -b cookies.txt http://localhost:3000/api/auth/me

curl -b cookies.txt -c cookies.txt -X POST \
  http://localhost:3000/api/auth/refresh
```

Examples contain placeholders only; no credentials, JWT secrets, database URLs, real staff records, or real child information are included.

## Authentication and access

The backend reads `access_token` and `refresh_token` cookies. It does **not** read a Bearer token from the Authorization header.

- Login sets both cookies with HttpOnly, SameSite=Lax, and Path=/.
- The access cookie has a 15-minute maxAge; the refresh cookie has a 7-day maxAge. JWT expiry is separately controlled by token TTL configuration.
- Cookie Secure/Domain settings come from the existing environment.
- Refresh uses the refresh cookie only.
- Logout requires a valid access cookie, then clears both cookies.
- The endpoint called admin-login accepts matching staff credentials without an explicit ADMIN-role or Active-status check in this revision. Role checks happen on individual protected routes.
- Staff roles are free-form strings; ADMIN-protected routes require the exact uppercase `ADMIN` value.

The access column below records the actual middleware. Program creation, update and deletion are public in this revision. Admission deletion requires authentication but has no ADMIN-role middleware. These facts are documented as implemented; the documentation does not add or remove access controls.

## Endpoints

| Method | Path | Actual access |
| --- | --- | --- |
| `GET` | `/health` | Public |
| `POST` | `/api/auth/admin-login` | Public |
| `GET` | `/api/auth/me` | Authenticated |
| `POST` | `/api/auth/refresh` | Authenticated |
| `POST` | `/api/auth/admin-logout` | Authenticated |
| `POST` | `/api/staff/` | ADMIN |
| `GET` | `/api/staff/staff-all` | Public |
| `POST` | `/api/addmission/create-adimission` | Public |
| `GET` | `/api/addmission/all-adimission` | ADMIN |
| `DELETE` | `/api/addmission/application/delete/{id}` | Authenticated |
| `POST` | `/api/testimonial/testimonial-create` | ADMIN |
| `GET` | `/api/testimonial/list-testimonial` | Public |
| `PATCH` | `/api/testimonial/update/{id}` | ADMIN |
| `PATCH` | `/api/testimonial/testimonials/{id}/status` | ADMIN |
| `DELETE` | `/api/testimonial/delete/{id}` | ADMIN |
| `GET` | `/api/programs/list-program` | Public |
| `POST` | `/api/programs/create-program` | Public |
| `PATCH` | `/api/programs/update/{id}` | Public |
| `DELETE` | `/api/programs/{id}` | Public |
| `GET` | `/api/photo/list-photo` | Public |
| `POST` | `/api/photo/create-photo` | ADMIN |
| `GET` | `/api/photo/single-photo/{id}` | Public |
| `PATCH` | `/api/photo/update/{id}` | ADMIN |
| `PATCH` | `/api/photo/replace/{id}/image` | ADMIN |
| `DELETE` | `/api/photo/delete/{id}` | ADMIN |
| `GET` | `/api/events/list-event` | Public |
| `POST` | `/api/events/create-event` | ADMIN |
| `GET` | `/api/events/single-event/{id}` | Public |
| `PATCH` | `/api/events/update/{id}` | ADMIN |
| `DELETE` | `/api/events/delete/{id}` | ADMIN |
| `GET` | `/api/blog/list-blog` | Public |
| `POST` | `/api/blog/create-blog` | ADMIN |
| `GET` | `/api/blog/single-blog/{id}` | Public |
| `PATCH` | `/api/blog/update/{id}` | ADMIN |
| `PATCH` | `/api/blog/replace/{id}/image` | ADMIN |
| `DELETE` | `/api/blog/delete/{id}` | ADMIN |

## Request formats

### JSON

Admissions, login, testimonials, events, programs and metadata updates accept JSON. Send `Content-Type: application/json`. The app's JSON and URL-encoded parsers have a 1 MiB body limit.

Admission requests use nested objects: `childInfo`, `guardianInfo`, and optional `additionalInfo`. The admission route has no upload middleware, despite an outdated validator comment mentioning multipart. Use the actual nested JSON example in Swagger.

For PATCH metadata requests, provide at least one documented field. Unknown keys are stripped by non-strict Zod schemas; login and staff-create schemas explicitly reject unknown fields.

### Image uploads

Staff creation, photo creation, blog creation and image replacement use `multipart/form-data`, with exactly one file field named **image**.

Accepted MIME types are JPEG/JPG, PNG, WebP and GIF. The default maximum size is 5 MiB per image, configurable through `UPLOAD_MAX_FILE_SIZE_MB`. No local filesystem path should be sent as a JSON image value.

Example (Gallery, ADMIN cookie required):

```bash
curl -b cookies.txt -X POST \
  -F 'title=Classroom Discovery' \
  -F 'category=classroom' \
  -F 'imageDescription=Children exploring classroom materials' \
  -F 'status=draft' \
  -F 'image=@/absolute/path/classroom.jpg' \
  http://localhost:3000/api/photo/create-photo
```

The blog image-replacement route currently parses the upload before authentication; that middleware order is reflected in the contract's possible responses.

## Lists and filters

- Testimonials, programs, photos, events and blogs use page/limit pagination (defaults 1 and 10; maximum limit 100).
- Staff and admission lists are not paginated. Their counts are global and ignore current list filters.
- List status filters default to `All`, so public lists can include draft or unapproved records.
- The public testimonial list does not filter out `consentToPublish=false`. Approval and consent remain independent fields.
- Single photo/event/blog reads do not limit results to published status.
- Event upcoming/past comparisons use server time. upcoming replaces the lower date bound with now; past adds a strict upper bound at now.
- The blog author filter is an anchored, case-insensitive regular expression in this revision.
- Route names preserve existing spelling, including `addmission` and `adimission`.

## Errors

The contract includes the differing envelopes actually returned:

```json
{"success":false,"error":{"message":"Validation failed","details":[{"path":"title","message":"Title must be at least 2 characters"}]}}
```

```json
{"success":false,"message":"Photo not found."}
```

```json
{"message":"Upload error: File too large"}
```

Validation middleware uses **422**. Missing images/upload errors use **400**; authentication uses **401**, role failures **403**, missing resources **404**, duplicates **409**, and rate limiting **429**. Unhandled failures use **500**. Development error responses can contain a stack trace; production hides unhandled error details.

Most ID parameters are validated as 24-character hexadecimal ObjectIds. The admission-delete route has no ID-validation middleware, so malformed IDs can reach Mongoose and produce 500 responses.

If the entire admission `additionalInfo` object is omitted, the validator supplies literal example placeholders in this revision. Send the object explicitly to avoid those defaults. The OpenAPI schema records this behavior.

## Newer ZIP frontend differences

These newer client calls are **not registered in the inspected repository revision** and were not added to this contract:

| Newer frontend call | Verified repository list route |
| --- | --- |
| `/api/programs/published-program` | `/api/programs/list-program?status=published` |
| `/api/photo/list-published-photo` | `/api/photo/list-photo?status=published` |
| `/api/events/list-published-event` | `/api/events/list-event?status=published` |
| `/api/blog/list-published-blogs` | `/api/blog/list-blog?status=published` |
| `/api/testimonial/list-approved-testimonial` | `/api/testimonial/list-testimonial?status=approved` |

The testimonial entries are not equivalent: the repository list does not enforce publication consent. Compare the latest ZIP's actual backend before adapting this contract or changing any route.

## Files

- `openapi.json`: canonical machine-readable API contract.
- `index.html`: standalone Swagger UI viewer with the same contract embedded.
- `serve.mjs`: local-only static documentation server.
- `validate.mjs`: source/contract coverage and structure checks.
- `README.md`: setup, endpoint inventory, version notes and examples.

When updating openapi.json, refresh the JSON embedded in index.html as well. No existing backend or website file is changed by this folder.

## Swagger references

- [Swagger UI installation](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/)
- [Swagger UI configuration](https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/)
- [Cookie authentication](https://swagger.io/docs/specification/v3_0/authentication/cookie-authentication/)
