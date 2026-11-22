---
name: emdash-on-google-sites
description: Add an EmDash blog under /blog on a Google Sites custom domain with Cloudflare Workers, remove the Google Sites redirect page for own-domain links, and match the blog's header/drawer/footer to Sites. Use when someone runs a Google Sites site on Cloudflare and wants a blog or CMS on the same domain.
---

# EmDash on Google Sites

Apply one part at a time. After each part, run its CHECK and show the result before continuing.

## Ask first
1. The Google Sites hostname (e.g. `www.example.com`) and the zone (`example.com`).
2. The blog's own hostname (e.g. `blog.example.com`).
3. Where the existing Sites proxy Worker lives (repo or Cloudflare dashboard).
4. Which parts they want: 01, 02, 03.
Never ask for or write API tokens, account IDs or passwords into files. Use `wrangler login`.

## Part 01 - redirect fix
- Add `unwrapOwnLinks()` from `01-redirect-fix/worker-snippet.js` to the Sites proxy Worker.
  Set `OWN_DOMAIN`. Apply it only to `text/html` responses.
- Run `01-redirect-fix/CHECK.md`. Expected: 0 wrapped own-domain links.

## Part 02 - blog under /blog
- In the EmDash project, replace `src/worker.ts` with `02-blog-on-sites-domain/worker.ts`;
  set `BLOG_HOST` and `PUBLIC_HOST`.
- Merge the `routes` from `wrangler.example.jsonc` into `wrangler.jsonc` (keep the user's
  existing bindings). Deploy with `npx wrangler deploy` or their Git deploy.
- Run every row of `02-blog-on-sites-domain/CHECK.md`. Stop and report any mismatch.

## Part 03 - match the Sites look
- Read the values from the user's own Sites stylesheet (see `03-match-sites-theme/README.md`);
  do not copy another site's design. Put tokens in `src/styles/theme.css`.
- Replace the header in `src/layouts/Base.astro` with `Header.example.astro` (adapted links,
  brand), append `header.example.css`, reuse their footer embeds as in `Footer.example.astro`.
- Run `03-match-sites-theme/CHECK.md` at 412 px. Report any visible difference.

## Done when
All requested CHECKs pass. Tell the user what changed, which files, and the Limits in README.md.
