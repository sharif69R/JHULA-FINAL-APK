# Jhula Dudh Delivery (Android)

The Jhula Dudh Delivery game packaged as an Android app. The game itself is plain HTML/JS/canvas, shown full screen in a WebView.

## Get the APK (easiest: GitHub builds it for you)
1. Create a new repository on GitHub and upload **everything in this folder** (keep the folder structure, including the hidden `.github` folder).
2. Open the repo's **Actions** tab. The **Build APK** workflow starts by itself after you push. You can also press **Run workflow**.
3. When it turns green, open the run and download **JhulaDudhDelivery-APK** from *Artifacts*. Unzip it to get `JhulaDudhDelivery-debug.apk`.
4. Copy the APK to your phone and open it. Android will ask you to allow installing from this source.

Using Git from a terminal:
```
git init
git add .
git commit -m "Jhula Dudh Delivery"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
git push -u origin main
```

## Build locally instead
Needs JDK 17, the Android SDK (platform 34) and Gradle 8.5+:
```
gradle assembleDebug
```
The APK ends up in `app/build/outputs/apk/debug/JhulaDudhDelivery-debug.apk`. Android Studio can also open this folder and run it on a device.

## Project layout
```
app/src/main/assets/www/        the game (index.html, css/, js/, assets/images/)
app/src/main/java/.../MainActivity.java   full-screen WebView, landscape, back button, pause on background
app/src/main/res/               app name, theme, launcher icons (made from the logo)
app/build.gradle                app id com.jhuladudh.delivery, minSdk 21, targetSdk 34
.github/workflows/build-apk.yml cloud build
app-icon-512.png                512px icon for a store listing
```

## Changing the game
Edit the files in `app/src/main/assets/www/` (the logo is `assets/images/logo.png`, the code is `js/game.js`), push, and download the new APK from Actions. Raise `versionCode` in `app/build.gradle` when you publish updates.

## Phone behaviour
- Back button: pauses a ride; from any other screen it returns to the title; from the title it closes the app.
- The game pauses when you switch away from the app.
- Progress (money and upgrades) is saved on the device.
- The title font (Lilita One) is fetched from Google Fonts, so it needs internet. Offline the game still runs with a plain fallback font.

## Releasing on Google Play
The workflow produces a debug-signed APK, which is fine for installing and sharing. Play Store needs a release build signed with your own keystore (Play prefers an AAB: `gradle bundleRelease`). Create a keystore, add a `signingConfigs` block to `app/build.gradle`, and keep the keystore and its passwords out of the repo (use GitHub Secrets).
