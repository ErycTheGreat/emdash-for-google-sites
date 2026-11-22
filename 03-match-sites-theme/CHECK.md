# Check: the blog matches Sites on mobile

1. Open your Sites page and the blog side by side in two windows 412 px wide.
2. Compare: header height (56 px), logo size (40 px), burger position. Expected: identical.
3. Tap the burger on both. Expected: drawer 250 px wide slides in over .5 s; burger turns into an x
   in .45 s; scrim darkens the page.
4. Tap the scrim. Expected: drawer closes, burger returns.
5. Scroll to the footer. Expected: the same embed content as on Sites.

Tip: background tabs freeze CSS transitions. To read end states in DevTools, inject
`* { transition: none !important; }`, read the values, then remove it.

Not tested: Safari, Firefox and physical phones; reduced-motion on the Sites original.
