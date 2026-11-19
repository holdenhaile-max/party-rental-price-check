const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|mailto:)/i;

function prefixOf(base) {
  if (!base || base === "/") return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function splitSuffix(path) {
  const match = path.match(/^([^?#]*)(.*)$/);
  return [match[1], match[2]];
}

/** Internal page URL with the site base and a trailing slash. Files stay unsuffixed. */
export function pageHref(path = "/", base = "") {
  if (!path) return pageHref("/", base);
  if (EXTERNAL.test(path)) return path;

  const prefix = prefixOf(base);
  const clean = path.startsWith("/") ? path : `/${path}`;
  const [pathname, suffix] = splitSuffix(clean);
  const isFile = /\.[a-z0-9]+$/i.test(pathname);
  let page = pathname;
  if (!isFile) {
    if (page.length > 1 && page.endsWith("/")) page = page.slice(0, -1);
    page = page === "" || page === "/" ? "/" : `${page}/`;
  }
  if (page === "/") return prefix ? `${prefix}/` : "/";
  return `${prefix}${page}${suffix}`;
}
