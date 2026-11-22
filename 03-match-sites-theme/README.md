# 03 - Make an EmDash blog look like its Google Sites homepage

This folder is the **method**, not anyone's design. Colors, names and links are dummies.
Swap in the values you read from your own Google Sites page.

## Where the look lives in EmDash

| What | File in your EmDash project | Why |
|---|---|---|
| Colors, fonts, sizes | `src/styles/theme.css` | Unlayered rules here beat EmDash's `@layer base` defaults, so you override without editing core files. |
| Header, burger, drawer markup | `src/layouts/Base.astro` | The header markup has to match Sites (burger left, logo, nav). The template asks you not to edit this file for visual changes; matching Sites needs new markup, so this is the one exception. |
| Footer | `src/layouts/Base.astro` | Reuse the footer embeds you already made for Sites (Sites "Embed code" HTML) instead of rebuilding them. |

## Steps

1. **Read the values from Sites, do not guess.** Open your Sites page, find its stylesheet in the
   page head (served from www.gstatic.com), and read the rules for the header, drawer, burger and
   dropdown. Sites changes layout at 480, 768 and 1280 px; the mobile drawer applies at 767 px and under.
   Check: you have a list like the one in `header.example.css` (sizes, durations, easing).
2. **Copy the tokens.** Put your Sites colors and font into `tokens.example.css` and append it to
   `theme.css`. Check: body background and text match Sites when viewed side by side.
3. **Replace the header markup.** Use `Header.example.astro` in place of the template header in
   `Base.astro`. Check: on a 412 px wide window the burger, logo and search sit where Sites puts them.
4. **Copy the motion.** Append `header.example.css`. The burger morph and drawer slide use the values
   read in step 1. Check: open and close the drawer on Sites and on the blog; the timing matches.
5. **Reuse the footer.** See `Footer.example.astro`: it imports your existing embed HTML files with
   `?raw` and shows each in an iframe, exactly as Sites does. Check: the footer looks the same on both.

## Values read from Google Sites (mobile, read 2026-11-22; Google can change them)

| Part | Value |
|---|---|
| Header | sticky, 56 px high |
| Burger button | 48 x 56 px |
| Logo | 40 x 40 px |
| Drawer | 250 px wide, `transform .5s cubic-bezier(.4,0,.2,1)` |
| Scrim | `rgba(0,0,0,.6)`, fades over .5 s |
| Drawer items | 16 px text, 21 px rows, 29 px pitch |
| Current page | 8 px left border in the accent color, bold |
| Burger morph | svg turns 90deg in .45 s; top/bottom bars rotate 45deg / 135deg with a 5 px shift; middle bar fades after .45 s |
| Dropdown | opens over .25 s (margin-top + clip-path) |
