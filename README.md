# gceya7.github.io

One-section promo page for my GitHub profile. Full-bleed portrait, contacts in
the empty half, one button → the real site at
[akha.gakhanani.workers.dev](https://akha.gakhanani.workers.dev).

No framework, no build step, no JavaScript — just `index.html` + `style.css`
+ two JPGs. This repo is the entire deploy; GitHub Pages serves it as-is.

## Replacing the old portfolio repo with this

1. In this repo's **Settings → Pages**, make sure the source is **Deploy from
   a branch**, branch `main`, folder `/ (root)`.
2. Push this folder as the full contents of `gceya7.github.io` (replacing
   whatever was there before, e.g. the old Next.js portfolio source).
3. Wait a minute for Pages to rebuild, then check `https://gceya7.github.io`.

If you're moving the old portfolio's source out of public GitHub entirely,
do that in its own repo (make it private, or delete it) — it's unrelated to
this one.

## Editing

- **Photo**: replace `assets/portrait-2000.jpg` / `assets/portrait-1100.jpg`
  (keep the same filenames, or update the `src`/`srcset` in `index.html`).
  `assets/og-share.jpg` is the square crop used for link previews.
- **Text / links**: everything is in `index.html` — the panel content near
  the bottom of `<body>`.
- **Colours**: the CSS variables at the top of `style.css` (`--pink` is
  sampled from the photo's background so the panel blends into it).

## Preview locally

```bash
npx serve .
# or
python3 -m http.server 8000
```
