# Approach, Challenges & Unsolved Notes

---

## Approach

### Architecture Decisions

- **Independent metal lifecycle** — each metal has its own service, hook, loading state, error state, and retry logic. The entire stack (service → hook → component) is isolated per metal so a Gold API failure never affects Silver, Platinum, or Palladium rendering.

- **Two-layer data model** — REST hooks handle initial load, error surfaces, caching, and pull-to-refresh. A WebSocket layer (`useRealTimePrice`) sits on top and silently overlays live ticks without touching the REST error/loading state machine. If WebSocket drops, the REST layer continues working.

- **Different fetching strategy per metal** — deliberately chosen to demonstrate a range of patterns:
  - Gold → React Query with 60s auto-refetch (most common production pattern)
  - Silver → custom Axios hook with manual retry (shows imperative state management)
  - Platinum → React Query cache-first with 5min staleTime (demonstrates stale-while-revalidate)
  - Palladium → AbortController + timeout (shows request lifecycle control)

- **Mock-first, live-optional** — `USE_MOCK` auto-detects placeholder API keys. The app runs fully in demo mode with a built-in mock simulator for both REST and WebSocket. No account or network needed to demo the full UI.

- **Native driver for all animations** — every animation uses `useNativeDriver: true` (opacity, transform). Background color for flash effects uses plain `useState` to avoid the native-driver conflict that occurs when mixing animated `backgroundColor` with native-driver `opacity` on the same `Animated.View`.

- **Theme system** — colors, typography, spacing, shadows, and gradients are all in `src/theme/`. Components never hardcode values — they import from the theme, making it easy to swap the design system.

- **TypeScript strict mode** — all navigation params, API responses, hook return types, and component props are fully typed. No `any` escapes in production code paths.

---

## Challenges Encountered

### 1. React Native 0.86 + `react-native-reanimated` incompatibility

- **Problem:** RN 0.86 is New Architecture only. It completely removed the Old Architecture Java APIs — `UIManagerModuleListener`, `LayoutAnimationController`, `UIViewOperationQueue` — that Reanimated 3.x still compiles in its `src/main/java` source set. This caused 20 Java compile errors during the first Android build.
- **Root cause:** Even with `newArchEnabled=true`, Reanimated 3.19.5 does not conditionally skip compiling those Paper-era Java files on RN 0.86.
- **Fix:** Excluded Reanimated from Android/iOS native linking via `react-native.config.js` and removed the babel plugin. Since the app uses React Native's built-in `Animated` API throughout, Reanimated was never actually required.

### 2. Maven Central DNS failure on first build

- **Problem:** First `npx react-native run-android` failed with `No such host is known (repo.maven.apache.org)`. Gradle could not download `react-android-0.86.0-debug.aar`.
- **Root cause:** Stale Windows DNS cache blocking resolution of `repo.maven.apache.org`.
- **Fix:** `ipconfig /flushdns` cleared the cache. Also added Alibaba Maven mirrors to `android/build.gradle` and `android/settings.gradle` as permanent fallbacks for restricted network environments.

### 3. `StyleSheet.absoluteFillObject` not found with `moduleResolution: bundler`

- **Problem:** TypeScript could not resolve `StyleSheet.absoluteFillObject` when `tsconfig.json` used `moduleResolution: bundler`. Affected `GoldLoader`, `SilverLoader`, and `MetalCard`.
- **Fix:** Replaced all usages with inline `{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}` objects. Also switched `tsconfig.json` to `"extends": "@react-native/typescript-config"` which uses the correct module resolution for RN projects.

### 4. Native driver conflict in `MetalCard` flash animation

- **Problem:** The flash overlay `Animated.View` had both `opacity: flashOpacity` (animated with `useNativeDriver: true`) and `backgroundColor: flashBgColor` (an `Animated.AnimatedInterpolation`). React Native forbids mixing native-driver and JS-driver animated properties on the same node — it throws a runtime error.
- **Fix:** Replaced `Animated.Value` + interpolation for background color with plain `useState<string>`. The color updates synchronously via `setFlashBg()` when a tick arrives; only `opacity` remains animated through the native driver. No conflict.

### 5. Gradle file lock preventing `npm uninstall` on Windows

- **Problem:** After the Reanimated build failure, Gradle had created a `.lock` file inside `node_modules/react-native-reanimated/android/.gradle/`. Windows file locking prevented npm from renaming/removing the directory, causing `EBUSY` errors on every `npm uninstall` and `npm install` attempt — even after `gradlew --stop`.
- **Fix:** Killed all `java.exe` processes with `Stop-Process`, then force-deleted the folder with `Remove-Item -Recurse -Force`. Deleted `package-lock.json` to avoid npm restoring the package from its lockfile cache, then ran a clean `npm install`.

### 6. Stale TypeScript language server diagnostics

- **Problem:** After fixing `absoluteFillObject` references, VS Code continued showing errors at the old line numbers. The errors were cached by the TypeScript language server and had not been re-evaluated.
- **Note:** Not a real code error. Resolved by restarting the TS server: `Ctrl+Shift+P` → **TypeScript: Restart TS Server**.

---

## Unsolved / Known Limitations

- **`react-native-reanimated` excluded** — the spec listed it as a required library. It cannot be compiled against RN 0.86 in its current 3.x release due to the removed Old Architecture APIs. All animations use the built-in `Animated` API instead, which covers every animation in the project (spring, timing, sequence, loop, interpolation). A future upgrade to Reanimated 4.x (when it fully supports RN 0.86 New Architecture) would allow migrating to `useSharedValue` / `useAnimatedStyle` patterns.

- **`metalpriceapi.com` free tier is 50 req/month** — the Gold hook auto-refetches every 60 seconds. In a production deployment this would exhaust the free tier in under an hour. For real use, either upgrade the API plan or remove `refetchInterval` from `useGoldPrice.ts` and rely on manual refresh only.

- **Finnhub OANDA symbols may return no data** — Finnhub's free tier doesn't guarantee OANDA forex symbol availability. If the WebSocket connects but sends no ticks for a metal, the app silently stays on the last REST price. No error is surfaced to the user (by design — WebSocket is enhancement-only, not required data).

- **No persistent cache across app restarts** — React Query's cache is in-memory only. Prices do not survive an app restart. `react-native-mmkv` is installed and available as a persistence layer but the `persistQueryClient` integration was not wired up to keep scope focused.

- **iOS not tested** — the project was built and verified on Windows targeting Android. iOS requires a Mac with Xcode and CocoaPods. The code itself is platform-agnostic but native linking for `react-native-linear-gradient`, `react-native-vector-icons`, etc. has not been verified on iOS.

- **`react-native-vector-icons` fonts not manually linked** — on Android, vector icon fonts are auto-linked via autolinking. If icons appear as empty boxes, add the following to `android/app/build.gradle`:

  ```gradle
  apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
  ```

- **`settings.gradle` `dependencyResolutionManagement` conflict warning** — adding `dependencyResolutionManagement` with `PREFER_SETTINGS` mode causes a Gradle warning from `react-native-vector-icons` which tries to add its own `Google2` repository. This is a warning only, not an error, and does not affect the build.
