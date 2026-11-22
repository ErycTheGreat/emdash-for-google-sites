# Check: no wrapped links to your own domain

Run against each page of your site (replace example.com):

```bash
curl -s https://www.example.com/ | grep -o 'google.com/url?q=https%3A%2F%2Fwww.example.com[^"]*' | wc -l
```

Expected: `0` after the snippet is deployed (it counted every wrapped own-domain link before).

In a browser: click an internal link. Expected: the next page opens directly, no white
"Redirecting you to..." page in between.

Not covered: links to other domains (still wrapped by Google, by design).
