# Authentication image performance proposal

## What changes

- Nine WebP variants at quality 84: login at 480/768/1024 px, registration artwork at 400/640/896 px.
- `AuthArtwork.tsx` owns `srcSet`, `sizes`, dimensions, async decoding, and priority.
- Login and the first registration slide are eager/high priority, not lazy loaded.
- The second registration image is requested after the first loads, with low priority. Animation begins only once both have loaded; if the second fails, the first remains visible.
- The sidebar uses the 480 px WebP instead of the 1 MB original icon.
- A small registration-only wrapping fix prevents the existing privacy text from widening the page on phones. No shared checkbox behavior changed.
- Original PNG source assets are retained, not referenced by the modified app.

## Measured image resource bodies

Cold-cache local Chrome, device pixel ratio 1. These are encoded resource-body bytes, not decoded RGBA memory and not total page transfer size. Routes were opened directly. Both registration slides are included in the register totals.

| Screen | Original | Proposed | Reduction |
| --- | ---: | ---: | ---: |
| Login, 390 px | 1,048,108 B | 18,852 B | 98.2% |
| Login, 1280 px | 1,048,108 B | 31,636 B | 97.0% |
| Register, 390 px | 2,773,462 B | 55,330 B | 98.0% |
| Register, 1280 px | 2,773,462 B | 55,330 B | 98.0% |

Even selecting all three largest WebP versions uses 217,914 B instead of 3,821,570 B, a 94.3% reduction. Browsers choose one candidate per image, not every variant.

## Verification

- Current client baseline and proposed client both pass `npm run build`.
- Server passes `npm run build` with no server code changes.
- Targeted ESLint on changed client files: zero errors; an existing React Hook Form `watch()` compatibility warning remains in RegisterForm.
- Local cold-cache Chromium visits for login/register at 390 and 1280 px: all images load, no page JavaScript errors, correct priorities, no horizontal overflow after the wrapping fix.
- Registration/login links work; registration animation waits for image readiness.
- The public demo's login/register screens were checked separately in a browser. No accounts were created and no forms were submitted.

Local previews use a non-secret placeholder Firebase web configuration and intercepted unauthenticated API requests. They test rendering and image delivery, not real authentication or backend behavior. No production credentials were used.

## Limits and remaining work

These are byte reductions, not a claim that the page is 98% faster. No production LCP score, real-device timing, or authenticated end-to-end test is claimed. The build still warns about a roughly 1.75 MB minified JavaScript bundle; route-level code splitting is a separate improvement. Original PNGs remain in the repository as source assets. Do not merge or deploy without reviewing the changes and checking the real Firebase/API environment.
