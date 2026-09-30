import "@/lib/ssr-polyfill";
import {
  ClientOnly,
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { siteContentQuery } from "@/lib/public-data.queries";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ClientToasters } from "@/components/common/ClientToasters";
import { PageTransition } from "@/components/common/PageTransition";
import { ConversationSummaryProvider } from "@/hooks/useConversationSummary";
import { WhatsAppFloat } from "@/components/chat/WhatsAppFloat";
import { CallFloat } from "@/components/chat/CallFloat";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import appCss from "@/index.css?url";
import { absoluteUrl } from "@/lib/seo";

function ErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Something went wrong</title>
        <HeadContent />
      </head>
      <body>
        <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <h1>Something went wrong</h1>
          <p>Please <a href="/">go home</a> or refresh.</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Winteriors Decor | Interior Design & Fit Out UAE" },
      { name: "description", content: "17+ years of excellence in commercial interior design and fit-out solutions across Dubai & Abu Dhabi" },
      { name: "author", content: "Winteriors Decor LLC" },
      { name: "theme-color", content: "#6b21a8" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Winteriors Decor LLC" },
      { property: "og:title", content: "Winteriors Decor | Interior Design & Fit Out UAE" },
      { property: "og:description", content: "17+ years of excellence in commercial interior design and fit-out solutions across Dubai & Abu Dhabi" },
      { name: "twitter:title", content: "Winteriors Decor | Interior Design & Fit Out UAE" },
      { name: "twitter:description", content: "17+ years of excellence in commercial interior design and fit-out solutions across Dubai & Abu Dhabi" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/UVe5Gan4vvftMqlM6fJIDIM6Z8J2/social-images/social-1782108202730-winteiors-decor-og.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/UVe5Gan4vvftMqlM6fJIDIM6Z8J2/social-images/social-1782108202730-winteiors-decor-og.webp" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-9K69BRZ0CK",
        async: true,
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9K69BRZ0CK');
        `,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Winteriors Decor LLC",
          url: absoluteUrl("/"),
          logo: absoluteUrl("/favicon.png"),
          description: "Premium commercial interior design and fit-out company delivering turnkey workspace solutions across Dubai and Abu Dhabi for 17+ years.",
          telephone: "+971 2 6432711",
          areaServed: "AE",
          sameAs: [
            "https://facebook.com/winteriorsdecor",
            "https://instagram.com/winteriorsdecor",
            "https://linkedin.com/company/winteriorsdecor",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Winteriors Decor LLC",
          url: absoluteUrl("/"),
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  errorComponent: ErrorComponent,
  component: RootComponent,
});


function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppShell() {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <ClientOnly fallback={null}>
        <AdminToolbar />
      </ClientOnly>
      {isAdmin ? (
        <Outlet />
      ) : (
        <>
          <PageTransition>
            <Outlet />
          </PageTransition>
          <Footer />
          <ClientOnly fallback={null}>
            <WhatsAppFloat />
            <CallFloat />
          </ClientOnly>
        </>
      )}
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <RootDocument>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ConversationSummaryProvider>
              <TooltipProvider>
                <ClientOnly fallback={null}>
                  <ClientToasters />
                </ClientOnly>
                <AppShell />
              </TooltipProvider>
            </ConversationSummaryProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </RootDocument>
  );
}

