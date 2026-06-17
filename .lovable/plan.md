# Migrate to TanStack Start (Full SSR)

This is a large, multi-step migration. The current app is a Vite + React 18 SPA using `react-router-dom`, `@tanstack/react-query`, Supabase, Helmet, GSAP, Framer Motion, Tiptap, and an inline CMS. We will rebuild the routing/runtime layer on TanStack Start while keeping all UI, styling, data, and CMS behavior identical.

## Scope

In scope:
- Replace Vite SPA shell with TanStack Start (file-based routing, SSR, server entry).
- Convert every page in `src/pages/**` to a route under `src/routes/**`.
- Move per-page SEO (Helmet) into TanStack Router `head()` so it ships in the initial HTML.
- Server-render public pages (Home, Projects, Project Detail, Services, Service Category/Subcategory, About, Clientele, Blogs, Blog Detail, Contact, Enquiry, Unsubscribe, NotFound).
- Keep Admin (`/admin/*`) and auth-gated UI client-only (CSR islands inside SSR shell).
- Preserve Supabase client, RLS, CMS inline editing, GSAP/Framer animations, and design tokens.
- Add the SSR error-handling wrapper (server entry + error-capture + error page + root `errorComponent`) so deploy-time failures are debuggable.

Out of scope (no behavior change):
- Database schema, edge functions, design system, content, copy, admin features.

## Target structure

```text
src/
  routes/
    __root.tsx                 # Layout, Header/Footer, providers, errorComponent
    index.tsx                  # Home
    projects/index.tsx
    projects/$slug.tsx         # ProjectDetail (loader -> Supabase)
    services/index.tsx
    services/$category/index.tsx
    services/$category/$sub.tsx
    about.tsx
    clientele.tsx
    blogs/index.tsx
    blogs/$slug.tsx
    contact.tsx
    enquiry.tsx
    unsubscribe.tsx
    admin/route.tsx            # AdminLayout + auth guard (client island)
    admin/login.tsx
    admin/index.tsx
    admin/projects/index.tsx
    admin/projects/$id.tsx
    admin/content.tsx
    admin/enquiries.tsx
    admin/images.tsx
    admin/media.tsx
    admin/pages.tsx
    admin/users.tsx
  server.ts                    # SSR wrapper (lazy import + try/catch + response normalizer)
  lib/error-capture.ts         # globalThis listeners
  lib/error-page.ts            # dependency-free HTML fallback
  router.tsx                   # createRouter w/ defaultErrorComponent
  routeTree.gen.ts             # auto-generated, do not edit
```

## Migration steps

1. **Dependencies**: add `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/router-plugin`, `@lovable.dev/vite-tanstack-config`. Remove `react-router-dom`.
2. **Vite config**: switch to `defineConfig` from `@lovable.dev/vite-tanstack-config`, set `tanstackStart.server.entry: "server"`, keep existing path alias and Tailwind setup.
3. **Server entry & error handling**: add `src/server.ts`, `src/lib/error-capture.ts`, `src/lib/error-page.ts` per the TanStack SSR error-handling pattern.
4. **Root route** (`src/routes/__root.tsx`): mount `QueryClientProvider`, `TooltipProvider`, `Toaster`, `AuthProvider`, `Header`, `Footer`, `PageTransition`, floating Call/WhatsApp; register `errorComponent`; emit base `<head>` (title, meta, favicon, OG defaults, fonts).
5. **Route conversion**: port each `src/pages/*.tsx` to a `createFileRoute` file. Replace `useNavigate`/`Link` from `react-router-dom` with `@tanstack/react-router` equivalents. Replace `useParams` with the route's typed `useParams`.
6. **SEO via `head()`**: move every `<Helmet>` block into the route's `head()` so titles/meta/OG/JSON-LD are in the SSR HTML. Remove `react-helmet-async` provider once all pages are migrated.
7. **Data loading**: for pages that fetch Supabase content used by SEO/above-the-fold (ProjectDetail, BlogDetail, ProjectHighlights, ServiceCategory), add route `loader`s using `createServerFn` that read from Supabase with the anon key on the server, then hydrate React Query on the client. Keep purely interactive data (admin lists, enquiry submissions) as client-side queries.
8. **Client-only islands**: wrap GSAP, Framer Motion, Tiptap, and any `window`/`document` usage in `useEffect` or dynamic `import()` so SSR doesn't crash. Confirm `OptimizedImage`, `PageTransition`, `LoadingScreen` are SSR-safe.
9. **Admin shell**: keep `/admin/*` behind a client guard. Render a minimal SSR placeholder, then hydrate the existing admin tree. No SEO needed.
10. **Auth**: `useAuth` continues to run client-side; do not block SSR on the session. Anything role-gated renders a neutral skeleton during SSR.
11. **404 / errors**: implement `notFoundComponent` on root + per-route, and root `errorComponent` mirroring current `NotFound.tsx` styling.
12. **Cleanup**: delete `src/App.tsx` router setup, `src/main.tsx` SPA bootstrap, `react-router-dom` imports, Helmet provider. Update `index.html` (or remove if Start owns the document).
13. **Verify**: build, then for each public route check that view-source contains the expected `<title>`, meta description, OG tags, and primary content (real SSR, not just hydration).

## Technical notes

- Supabase client stays in `src/integrations/supabase/client.ts` and is safe on both sides (uses publishable anon key). Server functions can import it directly.
- Lovable Cloud env vars (`VITE_SUPABASE_*`) are exposed at build time; no extra secrets needed for SSR reads.
- Keep CMS inline editing fully client-side — it depends on contenteditable + admin auth.
- `tsconfig` `paths` for `@/*` must continue to resolve; the Lovable TanStack config preserves them.
- Do not edit `src/routeTree.gen.ts` or `src/integrations/supabase/client.ts`.
- After migration, the published worker entry is `src/server.ts` (set in both `vite.config.ts` and `wrangler.jsonc` if present).

## Risk / impact

- Every page file moves. Internal links (`<Link to=...>`, `navigate(...)`) across `Header`, `Footer`, `ProjectHighlights`, service pages, admin, etc. all need updating to the new router API.
- Any component that touches `window`/`document` at module top-level will break SSR until guarded.
- Expect a follow-up pass to fix SSR-only runtime errors uncovered during build/preview.

Approve to start implementation. I will execute the steps in the order above and verify SSR output before finishing.
