// Local test, no Cloudflare account needed: runs src/index.js against a stand-in Google Sites page.
// npm i -D miniflare@3 && node test/local-test.mjs
import { Miniflare } from "miniflare";
import { readFileSync } from "node:fs";

// Stand-in for Google Sites: HTML with wrapped own-domain + external links, and a non-HTML asset.
const SITES_HTML = `<!doctype html><html><body>
<a id="own" href="https://www.google.com/url?q=https%3A%2F%2Fwww.example.com%2Fblog&sa=D" data-url="https://www.google.com/url?q=https%3A%2F%2Fwww.example.com%2Fblog&sa=D">Blog</a>
<a id="look" href="https://www.google.com/url?q=https%3A%2F%2Fbadexample.com%2F&sa=D">Look-alike</a>
<a id="ext" href="https://www.google.com/url?q=https%3A%2F%2Fgithub.com%2F&sa=D" data-url="https://www.google.com/url?q=https%3A%2F%2Fgithub.com%2F&sa=D">GitHub</a>
<a id="plain" href="https://www.example.com/about">About</a>
</body></html>`;
const seen = [];
const mf = new Miniflare({
  modules: true,
  script: readFileSync(new URL("../src/index.js", import.meta.url), "utf8"),
  compatibilityDate: "2026-02-24",
  outboundService: (req) => {
    seen.push(req.url);
    if (req.url.endsWith("/logo.png")) return new Response("PNGDATA", { headers: { "content-type": "image/png" } });
    return new Response(SITES_HTML, { status: 200, headers: { "content-type": "text/html; charset=utf-8", "x-origin": "sites-stand-in" } });
  },
});

const r1 = await mf.dispatchFetch("https://www.example.com/");
const html = await r1.text();
const r2 = await mf.dispatchFetch("https://www.example.com/logo.png");
const png = await r2.text();
const pick = (id, attr) => (html.match(new RegExp(`id="${id}" href="([^"]*)" data-url="([^"]*)"`)) || html.match(new RegExp(`id="${id}" href="([^"]*)"`)) || [])[attr];
const out = {
  status: r1.status,
  originHeaderKept: r1.headers.get("x-origin"),
  forwardedUrl: seen[0],
  own_href: pick("own", 1), own_dataurl: pick("own", 2),
  ext_href: pick("ext", 1),
  lookalike_stays_wrapped: pick("look", 1).startsWith("https://www.google.com/url?q="),
  plain_href: pick("plain", 1),
  asset_untouched: png === "PNGDATA" && r2.headers.get("content-type") === "image/png",
  wrappedOwnLeft: (html.match(/google\.com\/url\?q=https%3A%2F%2Fwww\.example\.com/g) || []).length,
};
console.log(JSON.stringify(out, null, 1));
await mf.dispose();
