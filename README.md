# SoundLax Landing Page

A static clone of the SoundLax landing page (originally built in WordPress / Salient at
`bentoji.co.nz/soundlax-app/`), rebuilt as plain HTML/CSS/JS for hosting on Vercel.

## Structure

```
index.html        # the page
assets/style.css  # all styling (dark theme, Manrope/Inter/Instrument Sans)
assets/main.js    # mobile menu, scroll reveal, FAQ accordion, signup form
vercel.json       # static hosting config (clean URLs, asset caching)
```

## Local preview

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploy (Vercel)

This repo is a zero-config static site. In Vercel: **Add New → Project → import this repo**.
No build command, no framework — Vercel serves the files as-is. Every push to `main`
auto-deploys.

## Notes

- Images are currently referenced from the live WordPress site
  (`bentoji.co.nz/wp-content/uploads/...`). To make the page fully self-contained,
  download those files into `assets/img/` and update the paths.
- The newsletter form is front-end only (the original used a WordPress form plugin).
  Wire it to a form backend (Formspree, Vercel serverless, etc.) to collect submissions.
- To serve at the exact path `bentoji.co.nz/soundlax-app/`, a proxy/redirect layer
  is required since DNS can't split a domain by path.
