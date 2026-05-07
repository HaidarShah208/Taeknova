# Tikwando — Frontend

Production-grade, scalable frontend for the **Tikwando** premium uniforms ecommerce platform. Built with a modern, opinionated stack and feature-based architecture so it can grow into a full SaaS-level storefront.

## Tech Stack

| Layer            | Library                                                          |
| ---------------- | ---------------------------------------------------------------- |
| Framework        | React 19 + TypeScript (strict)                                   |
| Build Tool       | Vite 5                                                           |
| Styling          | Tailwind CSS 3.4, `tailwind-merge`, `clsx`, `class-variance-authority` |
| Routing          | React Router DOM 6 (lazy routes)                                 |
| State / API      | Redux Toolkit + RTK Query                                        |
| Forms            | React Hook Form + Zod                                            |
| Animations       | Framer Motion                                                    |
| Icons            | Lucide React                                                     |
| HTTP             | Axios                                                            |
| SEO              | React Helmet Async                                               |
| Notifications    | Sonner                                                           |
| Quality          | ESLint, Prettier, strict TypeScript                              |

## Folder Structure

```
src/
├── app/                # Application bootstrap (providers, store, router)
│   ├── providers/
│   ├── router/
│   └── store/
├── features/           # Feature-based modules (slices + RTK Query endpoints)
│   ├── home/
│   ├── products/
│   ├── categories/
│   ├── cart/
│   ├── auth/
│   ├── wishlist/
│   ├── checkout/
│   ├── orders/
│   └── dashboard/
├── components/
│   ├── ui/             # Primitive design-system components (CVA-based)
│   ├── shared/         # Domain-aware reusable components
│   ├── layout/         # Navbar / Footer / MobileMenu / Breadcrumb
│   └── forms/          # Form wrappers around RHF + Zod
├── layouts/            # Page-level layouts (Main / Auth / Dashboard)
├── pages/              # Route-level components (lazy loaded)
├── services/           # Axios client + base API setup
├── hooks/              # Reusable hooks
├── lib/                # Cross-cutting helpers (cn, formatters, validators)
├── utils/              # Pure utilities
├── constants/          # App-wide constants
├── types/              # Global TypeScript types
├── styles/             # Global CSS / tokens
├── assets/             # Static assets
└── main.tsx            # Entry point
```

## Path Aliases

Configured in `tsconfig.app.json` and `vite.config.ts`:

```
@/*          src/*
@app/*       src/app/*
@features/*  src/features/*
@components/*src/components/*
@layouts/*   src/layouts/*
@pages/*     src/pages/*
@hooks/*     src/hooks/*
@services/*  src/services/*
@lib/*       src/lib/*
@utils/*     src/utils/*
@constants/* src/constants/*
@app-types/* src/types/*
@styles/*    src/styles/*
@assets/*    src/assets/*
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Run dev server
npm run dev

# 4. Type-check, lint, and build for production
npm run typecheck
npm run lint
npm run build
```

## Scripts

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Start Vite dev server                            |
| `npm run build`      | Type-check and build for production              |
| `npm run preview`    | Preview production build                        |
| `npm run typecheck`  | TypeScript type-check (no emit)                  |
| `npm run lint`       | Run ESLint (zero warnings allowed)               |
| `npm run lint:fix`   | Auto-fix ESLint problems                         |
| `npm run format`     | Format with Prettier                             |

## Engineering Principles

- **Feature-based architecture** — each domain owns its slices, endpoints, components, and types.
- **Composition over duplication** — reusable primitives via CVA + tailwind-merge.
- **Separation of concerns** — UI components are dumb; logic lives in hooks/services/slices.
- **No manual `useEffect` data fetching** — use RTK Query.
- **Lazy-loaded routes** with code splitting via Vite's `manualChunks`.
- **Strict TypeScript** with `noUncheckedIndexedAccess` and `noImplicitOverride`.
- **Mobile-first**, accessible, semantic HTML.
