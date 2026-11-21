# Keith Goes Skiing website

Static landing page, support and privacy information, and friend challenge previews for the Keith Goes Skiing mobile game.

## Local development

Use the Node.js version in `.nvmrc` and Yarn Classic.

```sh
corepack enable
yarn install --frozen-lockfile
yarn dev
```

Edit `src/index.html` and `src/assets/`. Run `yarn build` to generate `public/`. Serve that directory over HTTP to preview the production build.

For a challenge preview, append `?challenge=<KGS23 code>` to the page URL. Use **Open challenge in the app** on a device with the game installed, or copy the code and paste it into **Play a Friend’s Challenge**. The copy button uses the browser clipboard on HTTPS or localhost and selects the code for manual copying if clipboard access fails.

## Deployment

See [Deployment](DEPLOYMENT.md) for the static package and GitHub Pages.
