# FutuBrowser

FutuBrowser is a React Router photo browsing app for viewing image thumbnails in a responsive grid. It is built as a single-page app with TypeScript, Tailwind CSS, and user-focused loading and error states.

## Main Functions

- Browse photos in a responsive thumbnail grid.
- Load more thumbnails with infinite scrolling.
- Prefetch the next page of thumbnails for faster browsing.
- Open photo details in a modal route at `/p/:photoId`.
- Navigate between previous and next photos from the modal.
- Retry failed initial loads or later page loads without losing already loaded photos.
- Support light and dark color schemes through Tailwind styling.
- Deploy as a GitHub Pages SPA with client-side route fallback.
