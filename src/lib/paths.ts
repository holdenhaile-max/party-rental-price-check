import { pageHref } from "./trailing-slash.mjs";

/** Base path without a trailing slash. Empty when the site is served at `/`. */
function basePrefix(): string {
  const raw = import.meta.env.BASE_URL || "/";
  if (raw === "/") return "";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

/** Root-relative path with the configured Astro base prefix and a trailing slash on pages. */
export function href(path = "/"): string {
  return pageHref(path || "/", basePrefix());
}

/** Absolute URL for canonical tags, Open Graph, and JSON-LD. */
export function absoluteUrl(path = "/"): string {
  const origin = (import.meta.env.SITE || "https://holdenhaile-max.github.io").replace(/\/$/, "");
  return `${origin}${href(path)}`;
}

/** Pathname with the base prefix removed, for nav state. */
export function sitePath(pathname: string): string {
  const prefix = basePrefix();
  let path = pathname || "/";
  if (prefix && (path === prefix || path.startsWith(`${prefix}/`))) {
    path = path.slice(prefix.length) || "/";
  }
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}
