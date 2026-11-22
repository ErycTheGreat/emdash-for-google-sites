// Minimal edge Worker for a Google Sites site on a custom domain.
// It forwards each request to Google Sites unchanged (fetch(request) goes to the origin
// behind the proxied DNS record) and only rewrites HTML on the way back.
//
// Included: part 01, removing Google's "Redirecting you to..." page for your own links.
// Add your own HTML changes in the same HTMLRewriter chain.

const OWN_DOMAIN = "example.com";

function unwrapOwnLinks(rewriter) {
  return rewriter.on(
    'a[href^="https://www.google.com/url?q="], a[data-url^="https://www.google.com/url?q="]',
    {
      element(el) {
        for (const attr of ["href", "data-url"]) {
          const value = el.getAttribute(attr);
          if (!value) continue;
          try {
            const u = new URL(value);
            if (u.hostname !== "www.google.com" || u.pathname !== "/url") continue;
            const target = u.searchParams.get("q");
            if (!target) continue;
            const host = new URL(target).hostname;
            // exact match or a real subdomain; plain endsWith() would also accept "badexample.com"
            if (host === OWN_DOMAIN || host.endsWith("." + OWN_DOMAIN)) el.setAttribute(attr, target);
          } catch (_) {}
        }
      },
    },
  );
}

export default {
  async fetch(request) {
    const response = await fetch(request);
    const type = response.headers.get("content-type") || "";
    if (!type.includes("text/html")) return response;

    const headers = new Headers(response.headers);
    headers.delete("content-length"); // the body changes size
    const rewritten = unwrapOwnLinks(new HTMLRewriter()).transform(response);
    return new Response(rewritten.body, { status: response.status, headers });
  },
};
