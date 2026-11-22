# Check: who answers which path

Replace example.com. Expected results after deploy:

| Request | Expected |
|---|---|
| `curl -sI https://www.example.com/` | 200, served by your Google Sites proxy |
| `curl -sI https://www.example.com/blog/` | 200, HTML from EmDash |
| `curl -s https://www.example.com/blog/ \| grep -o 'href="/[^"]*"' \| head` | every internal link starts with `/blog/` (or `/_emdash`) |
| `curl -sI https://blog.example.com/posts/x` | 301 to `https://www.example.com/blog/posts/x` |
| `curl -sI https://blog.example.com/_emdash/admin` | not redirected (admin stays on the blog host) |
| `curl -s https://www.example.com/blog/rss.xml \| grep -c blog.example.com` | `0` |

Not covered: merging the blog's sitemap into the main site's sitemap (separate step).
