# Deployment

The game shares links to `https://keithski.eaxmarketplace.com/`. The homepage also provides the `#support` and `#privacy` links used by the game.

Run `yarn build` and publish the contents of `public/` to the site's document root. Keep `assets/social-1200x630.png` at its stable path for link previews.

For GitHub Pages, choose **GitHub Actions** as the Pages source in the repository settings and start **Deploy to GitHub Pages** from the Actions tab. Configure the custom domain and DNS before using GitHub Pages to serve the game's public links.

After deployment, open the support and privacy links and test a challenge shared from the installed app.

## Download links

In `src/index.html`, enable each card in `#downloads` once its public download is available. Add the verified destination as `href` and remove `role="link"` and `aria-disabled="true"` from that card. Use the public Keith Goes Skiing listing for each store and a publicly downloadable, release-signed APK for **Download APK**.
