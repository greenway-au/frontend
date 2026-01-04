# Repository Guidelines

## Project Structure & Module Organization
- `apps/client`, `apps/marketing`, and `apps/portal` are Next.js 15 front-ends; each owns its own `app/`, `components/`, and `public/` folders.
- `packages/ui` is the shared Tailwind 4 design system—export from `src/index.ts` and keep stories or demos inside `src/examples/`.
- Shared linting and TypeScript baselines live in `packages/eslint-config` and `packages/typescript-config`; extend them rather than inlining rules.
- Workspace plumbing (`turbo.json`, `pnpm-workspace.yaml`, `deploy.sh`, `vercel.json`) applies across every package.

## Build, Test, and Development Commands
- `pnpm install` installs dependencies with pnpm 10 and wires workspace symlinks.
- `pnpm dev --filter client` (swap the filter per app) runs the selected Next.js instance with Turbopack.
- `pnpm build --filter portal` validates a production bundle; run before raising a pull request.
- `pnpm lint --filter ./...` executes ESLint with the shared config; treat warnings as actionable.
- `pnpm format` applies Prettier to TS/TSX/MD; rely on it for formatting fixes.
- `pnpm deploy:portal` (or `deploy:all`) executes `deploy.sh` for Vercel pushes.

## Coding Style & Naming Conventions
- Prettier is the source of truth (2-space indent, single quotes); avoid hand-formatting.
- Write strongly typed React with explicit prop interfaces and narrow module exports in `packages/ui`.
- Use `PascalCase` for components, `camelCase` for utilities, and hyphenated filenames for shared UI primitives.
- Order Tailwind classes from layout → spacing → color to reduce diff churn.

## Testing Guidelines
- A universal test runner is not yet committed; add `*.test.tsx` adjacent to the component and register a `test` script when introducing coverage.
- Prefer React Testing Library for unit tests and add smoke coverage before exposing new UI primitives.
- Document manual QA steps in your PR until automated suites exist, and block merges on a clean `pnpm build` for affected apps.

## Commit & Pull Request Guidelines
- Follow the existing Conventional Commit pattern (`feat:`, `fix:`, optional scope) observed in the history.
- Group related work by commit and keep formatting-only changes separate.
- Pull requests must outline the problem, the solution, any new env vars, and include screenshots or Vercel preview links.
- Reference tracking tickets in the PR body and commit footers (`Refs: ABC-123`) when applicable.

## Deployment & Environment
- Each app consumes its own `.env.local`; never commit secrets and update the deployment checklist when keys change.
- Use `deploy.sh` for Vercel pushes to keep environments aligned, coordinating staggered deploys if edits span multiple apps.
