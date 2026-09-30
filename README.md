# Nepal Premier League Analysis

Player performance, domestic auction costs and season comparisons for NPL 1 and NPL 2. Created by Manoj Ghimire. Independent analysis; not affiliated with the league.

## Publish on GitHub Pages

In this repository, open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**. The **Publish NPL website** workflow builds and publishes each change pushed to `main`. The deployed address appears in the workflow's deployment result and in Settings → Pages.

If the first deployment ran before Pages was enabled, open **Actions → Publish NPL website**, select the failed run and choose **Re-run failed jobs**.

## Make changes

- Homepage: `components/story-home.tsx`
- Homepage cost analysis: `components/home-cost.tsx`
- Detailed cost analysis: `components/cost-analysis.tsx`
- Colours and Nepal-inspired details: `app/nepal.css`
- Photos: `public/media/`; player mapping: `public/data/identity-media.json`
- Data: `public/website_data.json` and `public/npl_analysis_master.csv`
- Source and image credits: `public/data/sources.json` and `public/data/media-ledger.json`

Keep the CSV and player records consistent; the build checks them. Supplied prices are audited separately in `public/data/client-price-audit.json`. Marquee salaries of NPR 20 lakh in each season are labelled assumptions. Foreign salaries are not estimated. Do not treat cost per run or wicket as financial profit.

To edit through GitHub, open a file, click the pencil, make the change and commit it. Wait for the Actions run to turn green. For larger changes, use a branch and pull request so you can review changes before publishing.

## Run on your computer

Install Node.js 22 and pnpm 10, then run:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

For a local production build: `pnpm build`. For the GitHub Pages subdirectory build:

```sh
PAGES_BASE_PATH=/npl-analysis pnpm build:pages
```

The Pages build temporarily prefixes internal URLs, images and data URLs, restores the editable source, and writes the site to `out`. It uses a static export; no server or database is required.

## Connect a purchased domain later

After buying a domain, set it in **Settings → Pages → Custom domain** and follow GitHub's displayed DNS instructions. Change `PAGES_BASE_PATH` in `.github/workflows/pages.yml` to an empty string for a domain served at its root, then publish again. Do not add a domain you do not own.

## Media

Player portraits and team marks retain their owners' rights; see the media ledger. The Himalayan photograph is credited to Bijay Chaurasia under CC BY-SA 4.0. The hero pose is an AI-edited editorial image and is labelled on the site. Source publication does not grant rights to third-party media.
