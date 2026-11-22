# D1 and R2: bindings, creation, limits, backups

## 1. The bindings in your EmDash project

`wrangler.jsonc` (Cloudflare side):

```jsonc
"d1_databases": [{ "binding": "DB", "database_name": "my-blog" }],
"r2_buckets":   [{ "binding": "MEDIA", "bucket_name": "my-blog-media" }],
"durable_objects": { "bindings": [{ "name": "EMDASH_ROOMS", "class_name": "EmDashRoom" }] }
```

`astro.config.mjs` (EmDash side):

```js
emdash({
  database: d1({ binding: "DB" }),
  storage: r2({ binding: "MEDIA" }),
})
```

Rule: the `binding` names must match in both files. Change one, change both.

Check: Cloudflare dashboard > Workers & Pages > your blog > **Bindings** lists `DB` (D1),
`MEDIA` (R2) and `EMDASH_ROOMS` (Durable Object).

## 2. Creating them

**Automatic (default).** `npm run deploy` creates the D1 database and R2 bucket named in
`wrangler.jsonc` on the first deploy. Do not rename them later, or the next deploy creates new,
empty ones. Astro's Cloudflare adapter also adds two bindings that are not in `wrangler.jsonc`:
`SESSION` (a KV namespace for Astro sessions) and `IMAGES` (Cloudflare Images). Both are adapter
defaults (`@astrojs/cloudflare` 14.4.9); expect five bindings in the dashboard, not three.

**Manual** (fixed names, or reuse an existing database), as in EmDash's Cloudflare guide:

```bash
npx wrangler d1 create my-blog          # prints a database_id; you may add it to wrangler.jsonc
npx wrangler r2 bucket create my-blog-media
```

Check: `npx wrangler d1 list` and `npx wrangler r2 bucket list` show both names.

## 3. Free plan limits (Cloudflare docs, checked 2026-11-22)

| | Free plan |
|---|---|
| D1 | 10 databases, 500 MB per database, 5 GB per account; daily row read/write limits |
| R2 | 10 GB-month storage, 1 million Class A and 10 million Class B operations per month |

Since 1 September 2026, D1 queries on the Free plan fail for the rest of the day (until midnight UTC)
once the account passes its daily row read or write limit. A small blog is far below it.

## 4. Backups

D1 keeps point-in-time recovery (Time Travel) for 7 days on the Free plan. To keep your own copy:

```bash
npx wrangler d1 export my-blog --remote --output=./backup.sql
```

Restore into a database: `npx wrangler d1 execute my-blog --remote --file=./backup.sql`.
