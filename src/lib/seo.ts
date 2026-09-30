export const SITE_URL = "https://www.winteriorsdecor.com";

export function absoluteUrl(pathname: string): string {
  return `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
}
