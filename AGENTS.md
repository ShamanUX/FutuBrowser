# AGENTS.md

## Project Root

- Work from `FutuBrowser/`; the parent folder is not the app root.
- Use `pnpm`; the lockfile is `pnpm-lock.yaml`.

## Commands

- Install: `pnpm install`
- Dev server: `pnpm dev`
- Test suite: `pnpm test`
- Watch tests: `pnpm test:watch`
- Typecheck: `pnpm typecheck`
- Lint and auto-fix: `pnpm lint`
- Production build: `pnpm build`
- Serve production build: `pnpm start`

## Verification

- Pre-commit runs `pnpm lint-staged && pnpm typecheck && pnpm test`.
- `pnpm typecheck` runs `react-router typegen` before `tsc`; run it after route or generated type changes.
- `pnpm lint` uses `--fix` and fails on warnings, so expect it to modify files.

## App Structure

- React Router routes are declared in `app/routes.ts`.
- `/` uses `app/routes/home.tsx`; `/p/:photoId` re-exports the Home route from `app/routes/photo.tsx`.
- The app is an SPA: `react-router.config.ts` has `ssr: false`.

## Component Convention

- Components with non-trivial state, routing, effects, or data fetching use Visual/Logic separation.
- `*Container` components own behavior such as API calls, route params, navigation, loading/error state, retries, and derived state.
- `*View` components own markup, layout, styling, accessibility attributes, and user-facing states passed as props.
- Purely visual leaf components can stay standalone when they do not need a logic layer.

## Testing Notes

- Vitest runs in `jsdom` with setup from `app/setupTests.ts`.
- Tests commonly mock `photosApi` and `react-infinite-scroll-component`; prefer focused component tests over real network calls.

## Deployment Notes

- GitHub Pages deployment uses `pnpm deploy`.
- `GITHUB_PAGES=true` changes the Vite base to `/FutuBrowser/` and React Router basename to `/FutuBrowser`.
- If the repository name changes, update both `vite.config.ts` and `react-router.config.ts`.

## Commit Messages

- Use short, lowercase, imperative commit messages.
- Examples: `add thumbnail grid loading states`, `fix photo modal navigation`, `update README coding conventions`.
