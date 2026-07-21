# MC Guidance — Site

Trilingual (Français / English / Kreyòl) static site with a JSON content layer.

## How it works

- **All text lives in `content/`** — one file per language:
  - `content/fr.json` (Français)
  - `content/en.json` (English)
  - `content/ht.json` (Kreyòl ayisyen)
- `build.js` turns those files into static pages with the language in the URL:
  - `/fr/services/` · `/en/services/` · `/ht/services/`
- The language switcher in the header links between the three versions of the same page.

## Editing content

1. Open the JSON file for the language you want to change (e.g. `content/fr.json`).
2. Edit the text. The three files share the same structure — if you add a step or a
   question in one language, add it in the other two as well.
3. Rebuild:

   ```sh
   node build.js
   ```

4. The updated site is in `dist/` — that folder is what gets deployed
   (Netlify, Vercel, GitHub Pages, or any static host).

## Preview locally

```sh
node build.js
python3 -m http.server 4173 -d dist
# open http://localhost:4173/fr/services/
```

## Structure

```
site/
  content/     fr.json, en.json, ht.json   ← edit these
  static/      styles.css, app.js          ← design & scroll-spy
  build.js     generates dist/ from content + templates
  dist/        generated output (do not edit by hand)
```
