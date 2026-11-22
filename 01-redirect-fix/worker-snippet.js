// 01 - Remove Google Sites' white "Redirecting you to..." page for links to your own domain.
//
// Google Sites wraps links in https://www.google.com/url?q=<target> AND navigates with a
// separate data-url attribute. Rewriting only href is not enough: rewrite both.
//
// Use inside the Cloudflare Worker that already proxies your Google Sites domain,
// on the HTML response from Sites.

const OWN_DOMAIN = "example.com"; // your domain; subdomains match too

export function unwrapOwnLinks(response) {
  return new HTMLRewriter()
    .on('a[href^="https://www.google.com/url?q="], a[data-url^="https://www.google.com/url?q="]', {
      element(el) {
        for (const attr of ["href", "data-url"]) {
          const value = el.getAttribute(attr);
          if (!value) continue;
          try {
            const u = new URL(value);
            if (u.hostname !== "www.google.com" || u.pathname !== "/url") continue;
            const target = u.searchParams.get("q");
            if (target && new URL(target).hostname.endsWith(OWN_DOMAIN)) el.setAttribute(attr, target);
          } catch (_) {
            // not a URL: leave it alone
          }
        }
      },
    })
    .transform(response);
}

// Example wiring inside your existing fetch handler:
//
// export default {
//   async fetch(request, env, ctx) {
//     const res = await fetch(request);            // or however you reach Sites
//     const type = res.headers.get("content-type") || "";
//     return type.includes("text/html") ? unwrapOwnLinks(res) : res;
//   },
// };
//
// External links (other domains) keep Google's wrapper on purpose.
