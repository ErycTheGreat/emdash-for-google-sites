# EmDash for Google Sites™

Add a real blog to a Google Sites website, on the same domain, with Cloudflare Workers and
[EmDash](https://emdashcms.com/) (an Astro-based CMS that runs on Workers, D1 and R2).

Google Sites has no blog and no CMS. This repo is the working setup from
[www.eryc.my.id/blog](https://www.eryc.my.id/blog), cleaned into reusable parts.
All names, domains and brand values here are placeholders (`example.com`).

| Folder | What you get | Post |
|---|---|---|
| [`00-setup`](00-setup) | Google Sites on your domain, an edge Worker in front, a fresh EmDash blog (D1, R2) | [Part 0](https://www.eryc.my.id/blog/posts/add-a-blog-to-google-sites-emdash-cloudflare) |
| [`01-redirect-fix`](01-redirect-fix) | Remove the white "Redirecting you to..." page on links to your own domain | [Part 1](https://www.eryc.my.id/blog/posts/google-sites-redirecting-you-white-page-fix) |
| [`02-blog-on-sites-domain`](02-blog-on-sites-domain) | Serve EmDash at `www.example.com/blog` next to Google Sites | [Part 2](https://www.eryc.my.id/blog/posts/blog-on-google-sites-domain-cloudflare-workers) |
| [`03-match-sites-theme`](03-match-sites-theme) | Make the blog's header, drawer and footer match Sites | [Part 3](https://www.eryc.my.id/blog/posts/match-google-sites-header-footer-motion-in-a-cms) |

Each folder has a `CHECK.md`: the command or test that proves the step worked, with the expected result.

## Quick start (about 1 hour end to end)

1. **Part 00** (`00-setup/README.md`): `npx wrangler login`, connect Google Sites to `www.example.com`,
   deploy the edge Worker, `npm create emdash@latest` + `npm run deploy` (D1 and R2 are created for you),
   finish the admin wizard. Run `00-setup/CHECK.md`.
2. **Part 01** is already inside the part 00 Worker. Run `01-redirect-fix/CHECK.md`.
3. **Part 02**: copy `worker.ts` into the blog's `src/worker.ts`, add the routes from
   `wrangler.example.jsonc`, `npm run deploy`. Run `02-blog-on-sites-domain/CHECK.md`.
4. **Part 03**: follow `03-match-sites-theme/README.md`. Run its `CHECK.md`.

You need: a published Google Site, a domain on Cloudflare (free plan is enough), Node.js 22.12+.

## Use it with an AI agent

[`SKILL.md`](SKILL.md) turns these steps into instructions an agent (e.g. Claude Code) can follow:
"Use the emdash-for-google-sites skill to put a blog at /blog on my Google Sites domain."
The agent asks for your domains, does parts 00 to 03 one at a time, runs each CHECK, and stops
to ask before it touches DNS or a live route.

## Limits

- Google can change Sites markup and CSS at any time; parts 01 and 03 depend on it.
- Built from one production site (desktop Chrome, a 412 px mobile frame). Not tested: Safari,
  Firefox, physical phones, and a full from-scratch run of these exact files on a new domain.

Google Sites is a trademark of Google LLC. This project is not affiliated with or endorsed by Google.
Unofficial: Google can change Sites at any time and break parts 01 and 03.

Written by Eryc Tri Juni S, Edge SEO & GEO Specialist (https://www.eryc.my.id/about). MIT licence.
