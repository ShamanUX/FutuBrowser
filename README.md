# FutuBrowser

FutuBrowser is a React Router photo browsing app. The current app focuses on one feature: browsing image thumbnails in a grid, with more features indicated as upcoming in the Home header.

## Current Functionality

- Home page with thumbnail browsing as the selected feature.
- Disabled upcoming feature button with an `Upcoming feature` tooltip.
- Infinite thumbnail grid backed by `jsonplaceholder.typicode.com/photos` metadata and Picsum image URLs.
- Prefetching for the next thumbnail page to make loading more items feel faster.
- Photo details modal opened from `/p/:photoId/` routes.
- Modal navigation for previous and next photos.
- Loading, retry, and error states for both the initial grid load and loading more thumbnails.
- Dark mode support through Tailwind's `prefers-color-scheme` handling.

## Tech Stack

- React 19
- React Router 7
- TypeScript
- Tailwind CSS 4
- Vitest
- Testing Library

## Setup

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

- `pnpm dev`: start the local React Router dev server with HMR.
- `pnpm test`: run the Vitest test suite once.
- `pnpm test:watch`: run tests in watch mode.
- `pnpm typecheck`: generate React Router types and run TypeScript checks.
- `pnpm lint`: run ESLint with auto-fix enabled and fail on warnings.
- `pnpm build`: create a production build.
- `pnpm start`: serve the production build from `./build/server/index.js`.

## Testing

Run all tests:

```bash
pnpm test
```

The test suite covers the Home route, thumbnail loading behavior, error and retry states, modal routing, modal navigation, and photo API URL mapping.

Run type checks:

```bash
pnpm typecheck
```

## Production Build

Create a production build:

```bash
pnpm build
```

Serve the built app locally:

```bash
pnpm start
```

React Router outputs the production build to `build/`, including client assets and server code.
