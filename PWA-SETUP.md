# PWA and push setup

## Files added or updated

- `manifest.json` describes the installable app and uses `src/app-icon.svg`.
- `sw.js` caches the app shell for offline page and asset access and imports OneSignal's service worker support.
- `js/pwa.js` registers `sw.js`, shows the browser's **Install App** prompt when supported, and contains the opt-in hook for OneSignal.
- Every main page (`index.html`, `about.html`, `academics.html`, `admissions.html`, `notices.html`, `gallery.html`, `contact.html`) links the manifest, sets the theme color, and loads `js/pwa.js`. The viewport tags were already correct.
- `css/style.css` already had tablet/mobile navigation and grid breakpoints; it now wraps notice rows and tightens phone header spacing.

## Deploy and install

1. Deploy the site over HTTPS. Service workers and web push require HTTPS; `http://localhost` is suitable for local development, but opening the HTML directly with `file://` is not.
2. Keep `manifest.json`, `sw.js`, and the HTML files at the same site root as they are here. Confirm `https://your-domain/sw.js` and `https://your-domain/manifest.json` are served as files, not rewritten to an HTML page.
3. Open the site in a supported browser. The **Install App** button appears only after the browser fires `beforeinstallprompt`; some browsers instead provide their own browser menu option. On iPhone/iPad, use Safari's **Share → Add to Home Screen**.
4. On a later release with changed cached assets, increment `CACHE_NAME` in `sw.js` so existing installations replace the old cache.

The service worker caches the main HTML pages, CSS, JavaScript, and supplied school assets. Content kept only in `localStorage` remains available only in that same browser/device and is not synchronized offline or online to other visitors.

## OneSignal subscription and notice broadcasts

1. Create a OneSignal app, enable its Web Push platform, and register the exact HTTPS site origin. Follow OneSignal's site verification and browser/platform setup.
2. Copy the **App ID** (public) into the `appId` constant near the top of `js/pwa.js`. Do not place a OneSignal REST API key in browser JavaScript or this repository.
3. Deploy and visit the site, then click **Enable Alerts**. The browser permission prompt is intentionally tied to this click. Check OneSignal's audience/subscriptions view to confirm the device subscribed.
4. Until an authenticated backend is connected, send test or manual broadcasts from the OneSignal dashboard.

Automatic “notify everyone whenever a notice/event is added” cannot be done securely with this static project as written. Admin-added entries currently live in each browser's `localStorage`; they do not reach other users. Also, a OneSignal REST API key must remain on a server. To automate broadcasts, move notice/event storage and admin authentication to a backend (or a protected serverless function), then have the publish action call that backend. The backend should save the shared notice and call OneSignal's Create Notification API with the secret API key. Do not expose that key in `js/notices.js`, `js/pwa.js`, or HTML. OneSignal's REST API uses a `Key ...` authorization header; see [OneSignal's API setup example](https://documentation.onesignal.com/docs/vue-js-setup).

The web client SDK and worker are prepared in `js/pwa.js` and `sw.js`. Do not enable the broadcast feature by putting the REST key in the static site.

## Responsive layout

All seven main HTML pages already had `width=device-width, initial-scale=1, viewport-fit=cover`. The shared stylesheet switches navigation to a menu at 860px, changes multi-column grids to two columns at tablet widths, and stacks them on phones at 520px. The notice/event rows and header controls now also wrap at phone widths.

## Remaining limitation in the current admin UI

The notices page contains hard-coded admin credentials in client-side JavaScript, and the browser performs the add/delete actions locally. Client-side credentials are visible to every visitor and are not secure authentication. Before publishing this site as an admin-managed notice system, replace that flow with server-side authentication and shared storage. This is also the required foundation for automatic push broadcasts.
