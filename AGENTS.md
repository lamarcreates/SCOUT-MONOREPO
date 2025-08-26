# Repository Guidelines

## Project Structure & Module Organization
- apps/frontend: Next.js app (app router), static assets in `apps/frontend/public`.
- apps/backend: Fastify API; entry at `apps/backend/src/main.ts`.
- libs/shared: Reusable `ui/`, `types/`, and `utils/` across apps.
- docs/: Design notes and operational docs.
- dist/: Build outputs (ignored by linting).

## Build, Test, and Development Commands
```bash
npm install                            # Install dependencies
npm run dev                            # Serve frontend + backend
npm run dev:frontend | dev:backend     # Serve individually
npm run build                          # Build all projects
npm run build:frontend | build:backend # Build individually
npm run test                           # Jest unit tests (all)
npm run lint                           # ESLint across workspace
npm run graph                          # Visualize Nx project graph
# E2E (Playwright)
npx playwright test -c apps/frontend-e2e/playwright.config.ts
# Or via Nx
yarn nx run frontend-e2e:e2e || npx nx e2e frontend-e2e
```

## Coding Style & Naming Conventions
- Indentation: 2 spaces; line endings/whitespace enforced via `.editorconfig`.
- Prettier: single quotes (`.prettierrc`); run `npx prettier --write .` before large changes.
- ESLint: Nx rules with module boundaries; run `npm run lint` and fix warnings.
- File names: kebab-case (e.g., `chat-message.tsx`); React components PascalCase.
- TypeScript first: prefer explicit types in shared `libs/shared/types`.

## Testing Guidelines
- Unit tests: Jest via Nx. Place `*.spec.ts`/`*.spec.tsx` next to sources.
- E2E: Playwright specs in `apps/frontend-e2e/src/*.spec.ts`.
- Run selective tests: `npx nx test <project>`; with coverage: `npx nx test <project> --coverage`.
- Aim to cover core utilities, API routes, and UI logic paths.

## Commit & Pull Request Guidelines
- Commit style: imperative, clear subjects; Conventional Commits (feat/fix/chore) welcome (seen in history).
- PRs: include purpose, linked issues, test plan, and screenshots/GIFs for UI.
- Requirements: green build (lint, test, build), small focused diffs, updated docs when applicable.

## Security & Configuration Tips
- Never commit secrets. Use `.env.local` (frontend) and `.env` (backend). Examples in `README.md`.
- Local API base: set `NEXT_PUBLIC_API_URL` for frontend; backend uses Fastify defaults (`HOST/PORT`).
- Validate new routes and tools don’t expose sensitive data in logs.

