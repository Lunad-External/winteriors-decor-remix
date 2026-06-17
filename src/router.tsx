import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-primary mb-3">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We hit an unexpected error. Please try again or head back home.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="px-5 py-2 bg-primary text-primary-foreground rounded"
            onClick={() => location.reload()}
          >
            Try again
          </button>
          <a className="px-5 py-2 border border-primary text-primary rounded" href="/">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient();
  return createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    defaultErrorComponent: DefaultErrorComponent,
    scrollRestoration: true,
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
