# Early Childhood Montessori & Academy

A responsive React + TypeScript implementation of the supplied UI screenshots. The project includes Home, About, Programs, Admissions, Team, Enrollment, Gallery, Events, Blog, and Contact.

## Run locally

```bash
npm install
npm run dev
```

Open the address Vite prints (usually `http://localhost:5173`). Run `npm run build` to create the production `dist/` directory.

## Content and design notes

- The Team page (`/team`) follows the new admin-page reference for all three tabs: 5 admins, 13 teachers, and 8 operators. The teachers and operators references supply names and roles only. The 21 supplied staff photos are stored in `public/assets/team/`. Five operators have no supplied photo and use initials in the same circular portrait frame. Edit `src/teamData.ts` to update staff details or add their photos. Use `/team?group=teachers` or `/team?group=operators` to open a specific tab directly. Tabs also support arrow keys, Home, and End.
- The enrollment page (`/enroll`) follows the supplied form reference and opens from Admissions → Start Your Application. It validates required fields, an exact 10-digit phone number, email, program selection, and a date of birth that is not in the future. A valid submission opens a prepared email for the parent to send; there is no server submission, database storage, or automatic email delivery. Application details are not saved to browser storage. The page explains the email step and provides a link to reopen the draft.
- Working days and hours are Monday–Friday, 9:00 AM–4:00 PM in the shared header, footer, Contact page, and enrollment help panel. These values and the supplied monthly tuition rates (Play Group Rs 2,900, Nursery Rs 3,200, Preschool Rs 3,400) are maintained in `src/schoolDetails.ts`. The rates are used on both Admissions and Enrollment. Partner logos are smaller on desktop and mobile.
- The original Figma layers and editable design tokens were unavailable, so screenshot matching is approximate. The supplied home, about/contact, blog, and logo files provide original images. The Gallery uses the designer's card layout with the supplied photos as the covers, beginning with 12 photos in the designer's category order. Its All filter contains all 125 gallery items exactly once, while category filters narrow the same set. Clicking any cover opens that same photo uncropped, with arrows and keyboard navigation between photos. A damaged Graduation 2081 image was recovered from the supplied ZIP. The graduation PNGs were encoded as visually faithful WebP assets at their original dimensions to keep the site download practical.
- The four Home welcome tiles now use original school photos: `gallery/classroom-03.jpg` (Montessori blocks), `gallery/classroom-02.jpg` (group learning), `gallery/classroom-01.jpg` (classroom books), and `gallery/activities-32.webp` (drawing). They fill the existing rounded two-by-two grid with individual crop positions and photo hover effects.
- The shared header shows the school's email on every page, and the footer address is Ranipauwa, Pokhara-11. The school's phone, two emails, and map location were checked in the original project against https://earlychildhood.edu.np/contact-us/. The detailed Tulsi Marg address comes from the previous screenshot; working days and hours follow the latest supplied instructions.
- The Contact page has an interactive Google map centered on the school's coordinates; its Open in Google Maps link and the footer address link use the supplied place URL.
- The supplied Devineers logo links to https://pocomat.com/pocomatdevineers-home and the supplied Computer Academy logo links to https://pocomat.com/computeracademy-home. The partner area shows both logos without a text label between them.
- The older reference screenshots show sample 2024 articles, 2025 events, and parent testimonials. **These are not verified school content.** The enrollment tuition amounts and application-review copy follow the newly supplied reference. Confirm school policies and fees before publication.
- The contact form opens the visitor's email app with a prepared message. It has no server or email delivery integration. The page never claims the message was sent.
- Motion across all pages includes route entrances, staggered scroll reveals, a slowly moving hero image, animated banner gradients, floating decorative shapes, card lift and pointer tilt on desktop, photo zoom, icon feedback, button ripples and shine, staggered mobile menus, staff tab and gallery filter transitions, lightbox image transitions, form focus and validation feedback, partner logo effects, and a reading-progress bar. `src/useSiteMotion.ts` coordinates scroll and interaction behavior; `src/motion.css` contains the animation styles. CSS and small browser observers are used without an extra animation dependency. Background animations pause off screen and all animation pauses in hidden browser tabs. Changes to the visitor's reduced-motion preference take effect immediately; reduced motion keeps content visible and disables movement. Keyboard focus reveals content immediately.
- Fonts are loaded from Google Fonts. Offline use falls back to system fonts.
- `public/_redirects` supports client routes on hosts that honor Netlify-style rewrites. Configure your host to serve `index.html` for all application paths.
