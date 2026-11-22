# Deployment

The game shares links to `https://keithski.eaxmarketplace.com/`. The homepage provides `#support`, `#privacy`, and `#terms`.

Run `yarn build` and publish the contents of `public/` to the site's document root. Keep `assets/social-1200x630.png` at its stable path for link previews.

For GitHub Pages, choose **GitHub Actions** as the Pages source in the repository settings and start **Deploy to GitHub Pages** from the Actions tab. Configure the custom domain and DNS before using GitHub Pages to serve the game's public links.

After deployment, open the support, privacy and terms links and test a challenge shared from the installed app.

## Region check for website analytics

For country-aware analytics, route only `https://keithski.eaxmarketplace.com/_visitor-region` to the Cloudflare Worker entry point `edge/visitor-region.mjs`. The handler uses Cloudflare's request country metadata and returns an uncached region classification without setting a cookie. Keep the site files on the existing static origin. [Cloudflare request metadata](https://developers.cloudflare.com/workers/runtime-apis/request/) · [Worker routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)

GitHub Pages serves static files. A build served without the region endpoint leaves GA4 off for all visitors. An unavailable or inconclusive check also leaves GA4 off. Before using this configuration publicly, verify that EU and undetermined visits make no Google Tag or GA4 requests and set no analytics cookies, and that a known non-EU visit loads the existing tag. Verify the same behavior on a friend challenge link and check that its token stays out of analytics requests.

## Download links

In `src/index.html`, enable each card in `#downloads` once its public download is available. Add the verified destination as `href` and remove `role="link"` and `aria-disabled="true"` from that card. Use the public Keith Goes Skiing listing for each store and a publicly downloadable, release-signed APK for **Download APK**.
