# NTU Reusable Container Scheme

Interactive proposal site for a deposit-based reusable-container network across NTU canteens — *takeaway, without the throwaway*. Built for the CC0006 group proposal.

Single-page React + Vite site: scroll-driven narrative, an interactive campus map, and a working deposit/return demo. Fully responsive down to mobile.

## Local development

```bash
npm install     # first time only
npm run dev     # http://localhost:3000
```

```bash
npm run build   # production build to dist/
npm start       # serve the built site on $PORT (default 3000)
npm run lint    # oxlint
```

## Deploy on Railway

The repo is Railway-ready — it builds the site and serves the static `dist/` folder.

1. Push this repo to GitHub (done).
2. On [railway.app](https://railway.app): **New Project → Deploy from GitHub repo** and pick this repo.
3. Railway reads [`railway.json`](./railway.json): it runs `npm run build`, then `npm start`, which serves `dist/` on the injected `$PORT`.
4. Under the service **Settings → Networking → Generate Domain** to get a public `*.up.railway.app` URL anyone can visit.

No environment variables are required.

## Project record

The original CC0006 proposal materials live in [`proposal/`](./proposal): the abstract & proposal PDF, the AI declaration, and the alternate design mockups.
