import "@/lib/ssr-polyfill";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClientToasters } from "@/components/common/ClientToasters";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { PageTransition } from "@/components/common/PageTransition";
import { ConversationSummaryProvider } from "@/hooks/useConversationSummary";
import { WhatsAppFloat } from "@/components/chat/WhatsAppFloat";
import { CallFloat } from "@/components/chat/CallFloat";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import appCss from "@/index.css?url";

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
      {
        title:
          "Winteriors Decor LLC | Premium Interior Design & Fit-Out Dubai & Abu Dhabi",
      },
      {
        name: "description",
        content:
          "Winteriors Decor LLC - 17+ years of excellence in commercial interior design and fit-out solutions.",
      },
      { name: "author", content: "Winteriors Decor LLC" },
      { name: "theme-color", content: "#6b21a8" },
      {
        property: "og:title",
        content: "Winteriors Decor LLC | Premium Interior Design & Fit-Out",
      },
      {
        property: "og:description",
        content:
          "17+ years of excellence in commercial interior design and fit-out solutions across Dubai & Abu Dhabi.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://lovable.dev/opengraph-image-p98pqg.png",
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
      { rel: "canonical", href: "https://winteriorsdecor.com" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  errorComponent: ErrorComponent,
  component: RootComponent,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
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
      <AdminToolbar />
      {isAdmin ? (
        <Outlet />
      ) : (
        <>
          <PageTransition>
            <Outlet />
          </PageTransition>
          <Footer />
          <WhatsAppFloat />
          <CallFloat />
        </>
      )}
    </>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <RootDocument>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ConversationSummaryProvider>
              <TooltipProvider>
                <LoadingScreen />
                <ClientToasters />
                <AppShell />
              </TooltipProvider>
            </ConversationSummaryProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </RootDocument>
  );
}
