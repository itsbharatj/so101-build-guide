# SO-101 Build Sheet

A one-page guide to building the open-source **SO-101** robot arm: what to buy, where to buy it in **your country**, and the official STL files to print.

**Live site:** https://itsbharatj.github.io/so101-build-guide/

![SO-101 follower and leader arms](assets/img/SO101_Follower.webp)

## What's on the page

- **Bill of materials.** Quantities change depending on whether you build *Leader + Follower* or *Follower only*. Totals use reference prices from the official BOM, and a checklist is saved in your browser.
- **Country-aware suppliers.** Pick from 60+ countries. Every part lists local or regional stores first, then sellers that ship worldwide. If your country isn't listed, choose **Global**.
- **Motor map.** Shows which STS3215 gearing (C001 / C044 / C046) goes on each leader joint.
- **Kits.** Complete and partial kits, filtered by region. Sellers named in the official repo are marked.
- **STL files.** Full plates for Prusa, Bambu A1 mini and Ender beds, every individual part, the fit gauges, and a 3D preview in the browser.
- **Printing services**, for people who don't have a printer.

Pre-select a country by linking to it, e.g. `?country=IN`, `?country=DE` or `?country=GLOBAL`.

## Project layout

```
index.html          page markup
css/styles.css      styles (light + dark)
js/config.js        Buy Me a Coffee link, author, repo URL
js/data.js          parts, countries, suppliers, kits, STL lists  ← edit this to add shops
js/app.js           rendering and interactions
js/viewer.js        three.js STL preview
assets/stl/         official STL files (Apache-2.0, TheRobotStudio)
scripts/check-links.sh   prints the HTTP status of every supplier link
```

There's no build step. It's plain HTML, CSS and JS.

## Run locally

```bash
python3 -m http.server 8101
```

Then open http://localhost:8101. The 3D preview only works over http, not when you open the file directly with `file://`.

## Publish on GitHub Pages

1. Push this folder as the `so101-build-guide` repo.
2. Go to **Settings → Pages → Build and deployment**, choose *Deploy from a branch*, and pick `main` / `(root)`.
3. The site goes live at `https://<user>.github.io/so101-build-guide/`.

## Adding or fixing a supplier

Every link lives in [`js/data.js`](js/data.js). Each part has a `buy` object keyed by region (`us`, `eu`, `uk`, `in`, `jp`, …). Add `{ store, url, kind: "direct" }` under the right region. Countries map to regions in the `COUNTRIES` table, which also sets the local Amazon domain and marketplace used for commodity searches.

Run `./scripts/check-links.sh` to spot dead links. A 403, 429 or 503 usually just means the store blocks bots.

## Credits

- SO-101 design: [TheRobotStudio](https://github.com/TheRobotStudio/SO-ARM100) with [Hugging Face LeRobot](https://huggingface.co/docs/lerobot/so101). STL files and photos are redistributed unchanged under Apache-2.0 (see `assets/stl/LICENSE-SO-ARM100.txt`).
- Site by **Bharat Jain**.

This guide is unofficial and isn't affiliated with TheRobotStudio, Hugging Face or any seller listed. Prices and stock change, so always check the exact servo variant before you pay.
