# EmDash on Google Sites

Add a real blog to a Google Sites website, on the same domain, with Cloudflare Workers and
[EmDash](https://emdashcms.com/) (an Astro-based CMS that runs on Workers, D1 and R2).

Google Sites has no blog and no CMS. This repo is the working setup from
[www.eryc.my.id/blog](https://www.eryc.my.id/blog), cleaned into reusable parts.
All names, domains and brand values here are placeholders (`example.com`).

| Folder | What you get | Post |
|---|---|---|
| [`01-redirect-fix`](01-redirect-fix) | Remove the white "Redirecting you to..." page on links to your own domain | Post 1 |
| [`02-blog-on-sites-domain`](02-blog-on-sites-domain) | Serve EmDash at `www.example.com/blog` next to Google Sites | Post 2 |
| [`03-match-sites-theme`](03-match-sites-theme) | Make the blog's header, drawer and footer match Sites | Post 3 |

Each folder has a `CHECK.md`: the command or test that proves the step worked, with the expected result.

## Before you start

- A Google Sites site on a custom domain (e.g. `www.example.com`) whose DNS is on Cloudflare.
- A Cloudflare Worker already proxying that domain to Google Sites (part 01 plugs into it).
- An EmDash project created from its Cloudflare blog template (see the EmDash docs for the current create command).
- Free Cloudflare plan is enough for everything here.

## Quick start

1. Part 01: add `unwrapOwnLinks()` to your Sites proxy Worker. Run `01-redirect-fix/CHECK.md`.
2. Part 02: copy `worker.ts` into your EmDash project's `src/worker.ts`, merge the routes from
   `wrangler.example.jsonc`, deploy. Run `02-blog-on-sites-domain/CHECK.md`.
3. Part 03: follow `03-match-sites-theme/README.md` (values read from Sites, not guessed). Run its `CHECK.md`.

## Use it with an AI agent

[`SKILL.md`](SKILL.md) turns these steps into instructions an agent (e.g. Claude Code) can follow:
"Use the emdash-on-google-sites skill to put a blog at /blog on my Google Sites domain."
The agent asks for your domains, applies one part at a time and runs each CHECK.

## Limits

- Google can change Sites markup and CSS at any time; parts 01 and 03 depend on it.
- Tested on one production site (desktop Chrome, a 412 px mobile frame). Not tested: Safari,
  Firefox, physical phones.

Written by Eryc Tri Juni S, Edge SEO & GEO Specialist (https://www.eryc.my.id/about). MIT licence.
