# Deployment

The game shares links to `https://keithski.eaxmarketplace.com/`. The homepage provides `#support`, `#privacy`, and `#terms`.

Run `yarn build` and publish the contents of `public/` to the site's document root. Keep `assets/social-1200x630.png` at its stable path for link previews.

For GitHub Pages, choose **GitHub Actions** as the Pages source in the repository settings and start **Deploy to GitHub Pages** from the Actions tab. Configure the custom domain and DNS before using GitHub Pages to serve the game's public links.

After deployment, open the support, privacy and terms links and test a challenge shared from the installed app.

## Region check for website analytics

The production page requests `https://api.country.is/` directly from the browser with cookies and referrer omitted. Country.is receives the visitor's IP, and the page reads the country code from its response. GitHub Pages serves the existing site without additional DNS records. [Country.is API](https://country.is/)

An unavailable or inconclusive check leaves GA4 off. Verify that EU visits and failed or undetermined lookups generate no Google Tag or GA4 requests and set no analytics cookies, and that a recognized non-EU visit loads the existing tag. Check the same behavior on a friend challenge link and verify that its token stays out of both the lookup and analytics requests.

## Download links

Enable the App Store and Google Play cards in `src/index.html` when their public listings are available. Add the destination as `href` and remove `role="link"` and `aria-disabled="true"` from that card.

The game's `publish:android:production` command updates the **Download APK** link and `src/data/android-production-download.json` after verifying the Google Play-signed APK from the public Zealot direct download. The command builds the site and pushes the link commit to this repository's GitHub `main`. A push that changes the download metadata triggers the Pages workflow. Use `workflow_dispatch` for other site deployments.
