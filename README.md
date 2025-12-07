
## Mestre Kame

React + TypeScript + Vite application for managing students (list and register).

This repository contains a minimal frontend built with Vite, React 19 and TypeScript. It includes ESLint, Tailwind, unit tests (Vitest + Testing Library) and a basic GitHub Actions CI workflow.

## Quick start

Install dependencies:

```powershell
npm install
```

Run development server:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
```

Lint code:

```powershell
npm run lint
```

## Tests

This project uses Vitest and Testing Library for unit tests. To run tests locally:

```powershell
# run tests (watch)
npm run test

# run tests once
npx vitest run
```

The test environment is configured to use `jsdom` and `@testing-library/jest-dom` matchers.

## Project structure (high level)

- `src/` - application source
  - `components/` - shared components (including `student` subfolder)
  - `pages/` - route pages (e.g. `Home.tsx`)
  - `assets/` - static assets
- `vitest.config.ts` - test runner config
- `.github/workflows/ci.yml` - basic CI workflow (lint, typecheck, build, tests)

## CI

A GitHub Actions workflow `.github/workflows/ci.yml` is included and runs on push and PR to `main`/`master`. It performs:

- `npm ci`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- `npx vitest run`

Push to the repository to trigger CI on GitHub.

## Notes about development

- Type model: `src/components/student/StudentTypes.ts` contains the `Student` model and a `NewStudentInput` type used for form inputs.
- Context: `src/components/student/StudentContext.tsx` provides student list and `addStudent`.
- Tests: see `src/components/student/__tests__` for examples covering the context and form.

## Contributing

- Run tests and lint before opening a PR.
- Keep commits small and focused.

---

If you want I can add a small `CONTRIBUTING.md` or extend the CI to upload coverage reports. What would you like next?
