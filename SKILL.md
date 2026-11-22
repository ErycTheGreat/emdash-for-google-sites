---
name: emdash-for-google-sites
description: Set up an EmDash blog (Cloudflare Workers, D1, R2) under /blog on a Google Sites custom domain, from zero, including Cloudflare login, the edge Worker in front of Google Sites, removing the Google Sites redirect page for own-domain links, and matching the blog's header/drawer/footer to Sites. Use when someone runs a Google Sites site and wants a blog or CMS on the same domain.
---

# EmDash for Google Sites

Work through parts 00 to 03 in order. After each part, run its CHECK and show the result before continuing.

## Rules
- Auth only through `npx wrangler login`. Never ask for, print or write API tokens, account IDs,
  zone IDs or passwords into any file or message.
- Before changing DNS, a Workers route on a live domain, or deploying to a live hostname, say exactly
  what will change and wait for the user's yes.
- Use the user's own names and values. Do not copy another site's branding or design.
- If a CHECK fails, stop, show the output, and fix that part before moving on.

## Ask first
1. The Google Sites hostname (e.g. `www.example.com`) and the Cloudflare zone (`example.com`).
2. Whether the domain's DNS is already on Cloudflare and the Site already uses this custom domain.
3. The blog's own hostname, if any (e.g. `blog.example.com`), or use the workers.dev URL.
4. Whether a Worker already sits on `www.example.com/*` (then merge into it instead of part 00 B).
5. Which parts they want.

## Part 00 - setup (00-setup/README.md)
- Before acting, explain the piece in one line using 00-setup/CONCEPTS.md (what it is, where it sits in the picture).
- Before deploying the blog, confirm the binding names match in wrangler.jsonc and astro.config.mjs (00-setup/STORAGE.md).
- Check Node.js >= 22.12. Run `npx wrangler login`.
- A: guide the user through Google Sites > Settings > Custom domains; the DNS record must be proxied.
- B: in `00-setup/sites-worker`, replace example.com, then `npx wrangler deploy` (ask first: live route).
- C: `npm create emdash@latest -- my-blog` (Cloudflare Workers, Blog template), `npm run deploy`;
  the first deploy creates D1, R2 and KV. Send the user to `/_emdash/admin/` to finish the wizard.
- Run `00-setup/CHECK.md`.

## Part 01 - redirect fix
- Already inside `00-setup/sites-worker`. For an existing Worker, add `unwrapOwnLinks()` from
  `01-redirect-fix/worker-snippet.js` to its HTML responses. Run `01-redirect-fix/CHECK.md`.

## Part 02 - blog under /blog
- Replace the blog's `src/worker.ts` with `02-blog-on-sites-domain/worker.ts`; set `BLOG_HOST`, `PUBLIC_HOST`.
- Add the routes from `wrangler.example.jsonc` to the blog's `wrangler.jsonc`, keeping its generated
  bindings. Ask first, then `npm run deploy`. Run every row of `02-blog-on-sites-domain/CHECK.md`.

## Part 03 - match the Sites look
- Read values from the user's own Sites stylesheet (`03-match-sites-theme/README.md`).
- Tokens into `src/styles/theme.css`; header from `Header.example.astro` into `src/layouts/Base.astro`;
  append `header.example.css`; reuse their footer embeds as in `Footer.example.astro`.
- Run `03-match-sites-theme/CHECK.md` at 412 px.

## Done when
All requested CHECKs pass. Tell the user what changed, in which files, and the Limits in README.md.
