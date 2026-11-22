// 02 - Serve an EmDash blog at https://www.example.com/blog on the same domain as Google Sites.
//
// How it works:
// - The blog is an EmDash site (Astro on Cloudflare Workers) that also answers on its own host
//   (BLOG_HOST). Workers Routes send www.example.com/blog*, /_emdash/* and /_astro/* to THIS worker;
//   everything else keeps going to the worker that proxies Google Sites.
// - Requests on PUBLIC_HOST are rewritten to BLOG_HOST with the /blog prefix removed,
//   handed to EmDash, and the HTML links are rewritten back under /blog.
// - Readers who land on BLOG_HOST get a 301 to the /blog address (one canonical home),
//   except the admin and assets, so sign-in on BLOG_HOST keeps working.

import handler, {
  createScheduledHandler,
  EmDashRoom,
  EmDashRoomSite,
  PluginBridge,
} from "@emdash-cms/cloudflare/worker";

export { EmDashRoom, EmDashRoomSite, PluginBridge };

const BLOG_HOST = "blog.example.com"; // the blog's own hostname
const PUBLIC_HOST = "www.example.com"; // your Google Sites hostname
const PREFIX = "/blog";

const fixPath = (v: string | null) =>
  v && v.startsWith("/") && !v.startsWith("//") && !v.startsWith(PREFIX + "/") && !v.startsWith("/_emdash")
    ? PREFIX + v
    : v;
const fixAbs = (v: string | null) =>
  v ? v.split("https://" + BLOG_HOST + "/").join("https://" + PUBLIC_HOST + PREFIX + "/") : v;
const fix = (v: string) => fixAbs(fixPath(v)) as string;
const fixSrcset = (v: string) => v.replace(/(^|,\s*)\/(?!\/)/g, "$1" + PREFIX + "/");

// JSON-LD lives in script text, which attribute handlers never see. Buffer it, then rewrite
// every https://BLOG_HOST URL (with or without a trailing slash) to the /blog address.
const jsonLd = () => {
  let buf = "";
  return {
    text(t: Text) {
      buf += t.text;
      if (!t.lastInTextNode) { t.remove(); return; }
      t.replace(buf.split("https://" + BLOG_HOST).join("https://" + PUBLIC_HOST + PREFIX), { html: true });
      buf = "";
    },
  };
};

async function serveUnderMainSite(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const target = new URL(request.url);
  target.hostname = BLOG_HOST;
  if (url.pathname === PREFIX || url.pathname.startsWith(PREFIX + "/")) {
    target.pathname = url.pathname.slice(PREFIX.length) || "/";
  }
  const res = await handler.fetch!(new Request(target.toString(), request) as never, env as never, ctx);
  const out = new Headers(res.headers);

  const loc = out.get("location");
  if (loc) {
    const l = new URL(loc, target);
    if (l.hostname === BLOG_HOST) {
      l.hostname = PUBLIC_HOST;
      l.pathname = fixPath(l.pathname) as string;
    }
    out.set("location", l.toString());
  }

  const type = out.get("content-type") || "";
  if (type.includes("text/html")) {
    const attr = (name: string, fn: (v: string) => string) => ({
      element(e: Element) {
        const v = e.getAttribute(name);
        if (v) e.setAttribute(name, fn(v));
      },
    });
    return new HTMLRewriter()
      .on("[href]", attr("href", fix))
      .on("[src]", attr("src", fix))
      .on("[action]", attr("action", fix))
      .on("[poster]", attr("poster", fix))
      .on("[srcset]", attr("srcset", fixSrcset))
      .on("meta[content^='https://" + BLOG_HOST + "']", attr("content", fix))
      .on('script[type="application/ld+json"]', jsonLd())
      .transform(new Response(res.body, { status: res.status, headers: out }));
  }
  if (type.includes("xml")) {
    // sitemap, RSS
    const text = fixAbs(await res.text()) as string;
    out.delete("content-length");
    return new Response(text, { status: res.status, headers: out });
  }
  return new Response(res.body, { status: res.status, headers: out });
}

export default {
  ...handler,
  async fetch(request, env, ctx) {
    const u = new URL(request.url);
    if (u.hostname === PUBLIC_HOST) return serveUnderMainSite(request, env, ctx);
    if (
      u.hostname === BLOG_HOST &&
      (request.method === "GET" || request.method === "HEAD") &&
      !u.pathname.startsWith("/_emdash") &&
      !u.pathname.startsWith("/_astro")
    ) {
      return Response.redirect("https://" + PUBLIC_HOST + PREFIX + u.pathname + u.search, 301);
    }
    return handler.fetch!(request as never, env as never, ctx);
  },
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
