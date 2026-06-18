# Bentoji Studio — website

Static, hand-built site (HTML/CSS/JS) hosted on Vercel. No build step — Vercel
serves the files as-is and every push to `main` auto-deploys. Designed to point
at **bentoji.co.nz** once DNS is switched at GoDaddy.

## Pages

| URL | File |
|---|---|
| `/` | `index.html` — homepage (studio, services, selected work, CTA) |
| `/portfolio` | `portfolio/index.html` — all work |
| `/work?p=<slug>` | `work/index.html` — data-driven project detail |
| `/soundlax-app` | `soundlax-app/index.html` — the SoundLax landing page |
| `/contact` | `contact/index.html` — info + Web3Forms form |
| `/soundlax/privacypolicy` | `soundlax/privacypolicy/index.html` — SoundLax privacy |
| `/writing` | `writing/index.html` — placeholder |

Shared design system: `assets/site.css` + `assets/site.js`.
(The SoundLax page keeps its own `assets/style.css` + `assets/main.js`.)

## Adding / editing portfolio projects  ← scalable

Everything reads from **`assets/projects.js`**. To add a project, copy a block
in that array and edit it. The homepage grid, the portfolio page, and the
detail page all update automatically.

- `link` set → the card links straight there (e.g. SoundLax → `/soundlax-app`).
- no `link` → the card opens `/work?p=<slug>`, rendered from `body`, `facts`, etc.
- `thumb` / `cover` image paths are optional. Leave them out and an animated
  gradient (from `c1`/`c2`/`c3`) is generated automatically.

**Projects 2–5 (Kōwhai, Driftwell, Anga, Field Notes) are placeholders.**
Replace their copy, and add real images under `assets/img/work/` when ready.

## Two things to finish

1. **Forms — add your Web3Forms access key.**
   The contact form is wired to [Web3Forms](https://web3forms.com) but needs a key:
   - Go to web3forms.com, enter **soundlax.studio@gmail.com**, get the access key by email.
   - In `contact/index.html`, replace `YOUR_WEB3FORMS_ACCESS_KEY`.
   - Submissions go to soundlax.studio@gmail.com. A hidden `cc` field is set to
     ben.ng189@gmail.com — if the free tier ignores cc, add ben as a CC in the
     Web3Forms dashboard, or set a Gmail auto-forward. (True BCC needs Web3Forms Pro.)
   - The SoundLax newsletter form is still front-end-only for now; it can be wired
     to the same key on request.

2. **Domain.** Point `bentoji.co.nz` at this Vercel project in GoDaddy DNS when ready.
   The SoundLax privacy link already targets `/soundlax/privacypolicy`.

## Local preview

```bash
npx serve .
```
