# FutuBrowser

FutuBrowser is a React Router photo browsing app. The current app focuses on one feature: browsing image thumbnails in a grid, with more features indicated as upcoming in the Home header.

## Coding Conventions

### Visual/Logic Component Separation

Components that need non-trivial state, routing, effects, or data fetching are split into two layers:

- `*Container` components own behavior: API calls, route params, navigation, loading/error state, retries, and derived state.
- `*View` components own presentation: markup, layout, styling, accessibility attributes, and user-facing states passed in as props.

Smaller purely visual components, such as `ThumbnailCard`, can stay as standalone components when they do not need a separate logic layer.

### Iconoir icon library

For icons, prefer the Iconoir library for consistent design.

### Git commits

#### Pre-commit hooks

With husky and lint-staged, we run linter and prettier formatter on staged files, in addition to tests and typecheck for all files, on every commit.

#### Commit naming

Use short, imperative commit messages that describe the intent of the change.
Preferred format:

<verb>: <scope or subject>
Examples:

```
feat: thumbnail grid loading states
fix: photo modal navigation
docs: README coding conventions
refactor: thumbnail grid container
test: photo API URL mapping
```

Guidelines:

- Use lowercase unless a proper noun is required.
- Start with an action verb such as feat, fix, refactor, test, or docs.
- Keep the subject concise and specific.
- Prefer describing why the change exists over listing every file touched.
- Avoid vague messages such as changes, fix stuff, or wip.

### AI Code review

Use the AI code review tool Qodo to review pull requests to catch hidden bugs. Always review the AI review comments and proposed changes before committing.

### Coding Agents

Review AGENTS.md content on a regular basis - keep it as short as possible to avoid it taking up too much of context window.

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
- `pnpm deploy`: build the SPA for GitHub Pages and publish `build/client`.

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

React Router outputs the production build to `build/`, including client assets and server code.

## GitHub Pages Deployment

Deploy the SPA to GitHub Pages:

```bash
pnpm deploy
```

The deploy script builds with the `/FutuBrowser/` base path, copies `build/client/index.html` to `build/client/404.html` for client-side route fallback, adds `.nojekyll`, and publishes `build/client` with `gh-pages`.

Use this for project pages served from `https://<username>.github.io/FutuBrowser/`. If the repository name changes, update the GitHub Pages base path in `vite.config.ts` and `react-router.config.ts`.
