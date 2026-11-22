# Check: setup done

Before deploying, test the edge Worker locally (no account needed):
`cd 00-setup/sites-worker && npm install && npm test`. Expected: `wrappedOwnLeft: 0`, own links unwrapped,
external link still wrapped, `asset_untouched: true`.

| Test | Expected |
|---|---|
| `curl -sI https://www.example.com/` | `200`, your Google Site |
| Cloudflare DNS record for `www` | proxied (orange cloud) |
| Cloudflare > Workers & Pages > sites-worker > Metrics | requests counted after you load the site |
| `npx wrangler d1 list` | lists the blog's database |
| `npx wrangler r2 bucket list` | lists the blog's media bucket |
| `https://<blog>.workers.dev/_emdash/admin/` | admin opens and you can sign in |
