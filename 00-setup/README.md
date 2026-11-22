# 00 - Setup: Google Sites on your domain, a Worker in front, an EmDash blog

Do this once. It takes about 30 minutes. Everything runs on Cloudflare's free plan
(sandboxed EmDash plugins need Workers Paid; this setup does not use them).

## You need
- A published Google Sites site, and a domain whose DNS is on Cloudflare (`example.com`).
- Node.js 22.12 or newer (EmDash's minimum; odd-numbered Node versions are not supported).
- A Cloudflare account. Log in once from your terminal: `npx wrangler login`
  (opens the browser; no API token or account ID goes into any file).

## A. Put Google Sites on www.example.com (Google's own custom-domain setup)
1. In Google Sites: **Settings > Custom domains > Start setup**, enter `www.example.com`,
   and follow Google's steps (it asks you to verify the domain and shows the DNS record to add).
2. In Cloudflare DNS, add exactly the record Google shows, with the proxy **on** (orange cloud).
   The proxy must be on, or Cloudflare Workers routes never see the traffic.

Check: `curl -sI https://www.example.com/` returns `200` and the page is your Google Site.

## B. Put a Worker in front of the site (the "edge")
The Worker in `sites-worker/` sits on the route `www.example.com/*`, passes every request on to
Google Sites unchanged, and only rewrites the HTML (part 01's redirect fix is already inside).

```bash
cd 00-setup/sites-worker
# edit wrangler.jsonc and src/index.js: replace example.com
npx wrangler deploy
```

Check: `curl -sI https://www.example.com/` still returns `200`; in the Cloudflare dashboard
the Worker's metrics show the request.

## C. Create the EmDash blog
```bash
npm create emdash@latest -- my-blog
```
When asked: **Where will you deploy? Cloudflare Workers**, then pick the **Blog** template.

```bash
cd my-blog
npm run deploy
```
On the first deploy Wrangler creates the D1 database, R2 bucket and KV namespace the site uses
(names come from `wrangler.jsonc`; do not rename them later, or the next deploy makes new, empty ones).
Open the `workers.dev` URL Wrangler prints and go to `/_emdash/admin/` to finish the setup wizard
(create the admin account).

Optional: give the blog its own hostname (`blog.example.com`) as a Custom Domain of this Worker
in the Cloudflare dashboard (Workers & Pages > your blog > Settings > Domains & Routes).
Sign-in for the admin is tied to the host you use for it, so pick one and keep it.

Check: `https://<your-worker>.workers.dev/` shows the blog and `/_emdash/admin/` lets you sign in.

## Next
- Part 01 is already in `sites-worker`. Run `01-redirect-fix/CHECK.md`.
- Part 02 moves the blog to `www.example.com/blog`.
- Part 03 makes it look like your Sites page.

Sources for the commands above: EmDash docs (docs.emdashcms.com) and Cloudflare's EmDash framework
guide (developers.cloudflare.com/workers/framework-guides/web-apps/emdash/), checked 2026-11-22.
