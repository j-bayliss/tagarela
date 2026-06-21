# Packaging Tagarela for app stores

Tagarela is an installable PWA (it has a web manifest, service worker and
maskable icons), so it can be added to the home screen today. To ship it in the
**Apple App Store** or **Google Play**, wrap the built site in a native shell.
Publishing requires your own developer accounts and native build tools — those
steps can't be automated here, but everything below is ready to go.

## Option A — Capacitor (iOS + Android, recommended)

Capacitor wraps the `dist/` build in a native WebView app.

```bash
# from the project root
npm install --save-dev @capacitor/cli
npm install @capacitor/core @capacitor/ios @capacitor/android

npx cap init Tagarela com.jbayliss.tagarela --web-dir=dist
npm run build            # produces dist/
npx cap add ios
npx cap add android
npx cap sync
```

Then:
- **Android:** `npx cap open android` → build a signed AAB in Android Studio →
  upload to the Google Play Console (one-off ~$25 developer fee).
- **iOS:** `npx cap open ios` → set your signing team in Xcode → Archive →
  upload via the Apple Developer Program (~$99/year). Requires a Mac.

Re-run `npm run build && npx cap sync` whenever the web app changes.

Tip: because the app stores data in `localStorage`, the native WebView keeps it
far more reliably than Safari/Chrome tabs (no 7-day eviction), which also fixes
the "keys/progress disappeared" problem.

## Option B — PWABuilder (fastest for Android)

1. Deploy the site (already on GitHub Pages: https://j-bayliss.github.io/tagarela/).
2. Go to https://www.pwabuilder.com and enter that URL.
3. Download the **Android** package (a Trusted Web Activity) and submit it to
   Google Play. PWABuilder can also generate an iOS package.

## Notes
- **Icons/splash:** `public/icon-192.png` and `public/icon-512.png` (maskable)
  are used. For richer native splash screens, add `@capacitor/splash-screen`.
- **Push notifications:** true scheduled reminders need a native plugin
  (`@capacitor/local-notifications`) or a push server — easy to add once wrapped
  with Capacitor, and the natural home for the daily-reminder feature.
- **Deep linking / scope:** the manifest `scope` and `start_url` are relative
  (`./`) so the app works from any host path, including GitHub Pages sub-paths.
