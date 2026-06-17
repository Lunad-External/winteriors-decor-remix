/**
 * Compatibility shim that re-exports react-router-dom-shaped APIs
 * backed by @tanstack/react-router. Aliased via vite.config so
 * `import ... from "react-router-dom"` continues to work during/after
 * the SSR migration.
 */
import {
  Link as TSRLink,
  useLocation as tsrUseLocation,
  useNavigate as tsrUseNavigate,
  useParams as tsrUseParams,
  useSearch as tsrUseSearch,
  useRouter,
} from "@tanstack/react-router";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

type LinkProps = {
  to: string;
  replace?: boolean;
  state?: unknown;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, replace, state: _state, children, ...rest }, ref) => {
    // External / hash / mail / tel links: render plain <a>
    if (
      typeof to === "string" &&
      (to.startsWith("http://") ||
        to.startsWith("https://") ||
        to.startsWith("mailto:") ||
        to.startsWith("tel:"))
    ) {
      return (
        <a ref={ref} href={to} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <TSRLink ref={ref as any} to={to as any} replace={replace} {...(rest as any)}>
        {children}
      </TSRLink>
    );
  },
);
Link.displayName = "Link";

export interface NavLinkRenderProps {
  isActive: boolean;
  isPending: boolean;
  isTransitioning: boolean;
}

type NavLinkProps = Omit<LinkProps, "className"> & {
  className?: string | ((p: NavLinkRenderProps) => string);
  style?: React.CSSProperties | ((p: NavLinkRenderProps) => React.CSSProperties);
  end?: boolean;
  children?: ReactNode | ((p: NavLinkRenderProps) => ReactNode);
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, end, className, style, children, ...rest }, ref) => {
    const location = tsrUseLocation();
    const pathname = location.pathname;
    const target = typeof to === "string" ? to : "/";
    const isActive = end ? pathname === target : pathname === target || pathname.startsWith(target + "/");
    const renderProps: NavLinkRenderProps = { isActive, isPending: false, isTransitioning: false };
    const resolvedClassName = typeof className === "function" ? className(renderProps) : className;
    const resolvedStyle = typeof style === "function" ? style(renderProps) : style;
    const resolvedChildren = typeof children === "function" ? children(renderProps) : children;
    return (
      <Link ref={ref} to={target} className={resolvedClassName} style={resolvedStyle} {...rest}>
        {resolvedChildren}
      </Link>
    );
  },
);
NavLink.displayName = "NavLink";

export type { NavLinkProps };

export function useLocation() {
  const loc = tsrUseLocation();
  return {
    pathname: loc.pathname,
    search: loc.searchStr ?? "",
    hash: loc.hash ?? "",
    state: (loc as any).state ?? null,
    key: (loc as any).href ?? loc.pathname,
  };
}

type NavigateOpts = { replace?: boolean; state?: unknown };
type NavigateFn = ((to: string | number, opts?: NavigateOpts) => void) & {
  (to: { pathname?: string; search?: string; hash?: string }, opts?: NavigateOpts): void;
};

export function useNavigate(): NavigateFn {
  const router = useRouter();
  const navigate = tsrUseNavigate();
  return ((to: any, opts?: NavigateOpts) => {
    if (typeof to === "number") {
      router.history.go(to);
      return;
    }
    let target: string;
    if (typeof to === "string") {
      target = to;
    } else {
      target = (to?.pathname ?? "/") + (to?.search ?? "") + (to?.hash ?? "");
    }
    if (target.startsWith("http://") || target.startsWith("https://")) {
      if (typeof window !== "undefined") window.location.href = target;
      return;
    }
    navigate({ to: target as any, replace: opts?.replace });
  }) as NavigateFn;
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  // strict:false returns all matched params across the tree
  return tsrUseParams({ strict: false }) as unknown as T;
}

type SetSearchFn = (
  next: URLSearchParams | Record<string, string> | ((prev: URLSearchParams) => URLSearchParams),
  opts?: { replace?: boolean },
) => void;

export function useSearchParams(): [URLSearchParams, SetSearchFn] {
  const loc = tsrUseLocation();
  const navigate = tsrUseNavigate();
  const params = new URLSearchParams(loc.searchStr ?? "");
  const set: SetSearchFn = (next, opts) => {
    let resolved: URLSearchParams;
    if (typeof next === "function") {
      resolved = next(new URLSearchParams(params));
    } else if (next instanceof URLSearchParams) {
      resolved = next;
    } else {
      resolved = new URLSearchParams(next);
    }
    const qs = resolved.toString();
    navigate({
      to: loc.pathname as any,
      search: Object.fromEntries(resolved.entries()) as any,
      replace: opts?.replace,
    });
  };
  return [params, set];
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const navigate = useNavigate();
  if (typeof window !== "undefined") {
    queueMicrotask(() => navigate(to, { replace }));
  }
  return null;
}

// No-op stubs for things only used at SPA bootstrap (App.tsx is being removed)
export function BrowserRouter({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
export function Routes({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
export function Route(_: any) {
  return null;
}
export const Outlet = () => null;
