# The big picture

Read this once before the steps. Every step in this repo is one box or one arrow below.

## Request flow (what a visitor hits)

```
visitor
  -> Cloudflare DNS (record for www, proxied = orange cloud)
  -> Workers Routes (the most specific pattern wins)
       www.example.com/*        -> edge Worker  -> Google Sites (your pages)
       www.example.com/blog*    -> blog Worker  (EmDash)            [part 02]
       www.example.com/_emdash/*, /_astro/* -> blog Worker          [part 02]
                                     |
                                     +-- binding DB           -> D1 database (posts, users, settings)
                                     +-- binding MEDIA        -> R2 bucket   (images, files)
                                     +-- binding EMDASH_ROOMS -> Durable Object (live co-editing rooms)
```

## Config flow (where you set each piece)

```
wrangler.jsonc    Cloudflare side: the Worker's name, its routes, and its bindings
                  (which D1 / R2 / Durable Object it may use, and under which name)
astro.config.mjs  EmDash side: which binding is the database and which is media storage
                  database: d1({ binding: "DB" })   storage: r2({ binding: "MEDIA" })
code              uses them as env.DB, env.MEDIA (EmDash does this for you)
```

The binding NAME is the link between the two files. `DB` in `wrangler.jsonc` must be `DB` in
`astro.config.mjs`. If they differ, EmDash cannot reach its database or storage.

## Glossary

| Word | Meaning here |
|---|---|
| Zone | Your domain inside Cloudflare (`example.com`). |
| Proxied DNS | The orange cloud. Traffic passes through Cloudflare, so Workers can run on it. |
| Worker | A small program running on Cloudflare, in front of or instead of a server. |
| Route | A URL pattern that sends matching traffic to a Worker. The more specific pattern wins. |
| workers.dev / custom domain | Addresses a Worker can answer on without a route. |
| Binding | A named connection that lets a Worker use a resource. `env.DB` = "the D1 database bound as DB". No passwords or connection strings. |
| D1 | Cloudflare's SQL database (SQLite). EmDash keeps content, users and settings in it. |
| R2 | Cloudflare's file storage. EmDash keeps uploaded media in it. Stays private: the blog serves files itself. |
| Durable Object | A small stateful object. EmDash uses one per entry being edited (co-editing rooms). |
| Service binding | One Worker calling another directly, not over the internet (part 02 uses it for the sitemap). |
| `wrangler` | Cloudflare's command-line tool (`npx wrangler ...`). |
| `wrangler.jsonc` | The Worker's settings file. |
| `astro.config.mjs` | The blog's settings file (EmDash is built on Astro). |
