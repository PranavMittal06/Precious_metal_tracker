# Precious Metals Tracker

A premium fintech-grade React Native CLI application displaying real-time prices for Gold, Silver, Platinum, and Palladium. Built as a professional portfolio assignment demonstrating advanced React Native architecture, independent API lifecycle management, luxury dark UI with glassmorphism, and WebSocket real-time data streaming.

---

## Features

- **Real-time WebSocket streaming** — live price ticks via Finnhub (or built-in mock simulator)
- **Live REST prices** — Metal Price API with per-metal caching and background refresh
- **4 independent metal data stacks** — one failure never affects the others
- **4 different fetching strategies** per metal (React Query auto-refresh, Custom hook + manual retry, Cache-first, AbortController + timeout)
- **4 unique loading animations** (Gold shimmer skeleton, Silver pulse breathing, Platinum rotating ring, Palladium wave bar graph)
- **Premium dark luxury UI** — glassmorphism cards, metallic gradients, per-metal color themes
- **Live price flash animations** — green/red overlay on every WebSocket tick
- **Offline detection** via NetInfo with animated banner
- **Pull-to-refresh** and manual refresh on every screen
- **Details screen** with animated count-up numbers, market stats grid, and share functionality
- **React Navigation v7** stack with smooth transitions
- **Full TypeScript** — strict mode, typed navigation params, typed API responses
- **Full error handling** — network errors, timeouts, API failures, empty states, per-metal retry

---

## Screenshots

> Run the app to see the premium UI in action.

| Home Dashboard | Metal Details |
|---|---|
| 4 independent metal cards with live WebSocket ticks | Full analytics with market stats, count-up prices, share button |

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React Native CLI | 0.86 | Framework (New Architecture) |
| TypeScript | 5.x | Type safety |
| React Navigation v7 | ^7.0 | Stack navigation |
| TanStack React Query | ^5.62 | Gold & Platinum data fetching |
| Axios | ^1.7 | HTTP client |
| React Native Animated | Built-in | All animations (native driver) |
| React Native Gesture Handler | ^2.22 | Gesture support |
| React Native Linear Gradient | ^2.8 | Card gradients |
| React Native Safe Area Context | ^5.5 | Safe area insets |
| React Native NetInfo | ^11.4 | Offline detection |
| React Native MMKV | ^3.1 | Fast local storage |
| Shopify FlashList | ^1.7 | Optimized list rendering |
| React Native SVG | ^15.11 | SVG support |

> **Note:** `react-native-reanimated` was intentionally excluded. React Native 0.86 uses New Architecture exclusively and removed the Old Architecture Java APIs (`UIManagerModuleListener`, `LayoutAnimationController`) that Reanimated 3.x still compiles. All animations in this project use React Native's built-in `Animated` API with `useNativeDriver: true`.

---

## Project Structure

```
d:\workspace\Precious_metal\
├── android/                             # Native Android project
│   ├── app/
│   │   └── build.gradle                 # App-level Gradle config
│   ├── build.gradle                     # Project-level (Maven mirrors added)
│   ├── settings.gradle                  # Dependency resolution + mirrors
│   └── gradle.properties                # newArchEnabled=true, hermesEnabled=true
├── src/
│   ├── components/
│   │   ├── MetalCard/                   # Shared card — flash animation, price bounce
│   │   ├── GoldLoader/                  # Shimmer skeleton with golden sweep
│   │   ├── SilverLoader/                # Pulse + scale breathing animation
│   │   ├── PlatinumLoader/              # Rotating ring progress indicator
│   │   ├── PalladiumLoader/             # Animated wave bar graph
│   │   ├── ErrorCard/                   # Per-metal error with retry button
│   │   ├── PriceBadge/                  # Trend badge (▲▼ %)
│   │   ├── MarketStatCard/              # Stat cell for details screen
│   │   ├── EmptyState/                  # Empty / no-data illustration
│   │   └── OfflineBanner/               # Animated offline indicator
│   ├── screens/
│   │   ├── HomeScreen/                  # Dashboard — 4 metals + WS status bar
│   │   └── DetailsScreen/               # Full analytics — count-up, stats, share
│   ├── navigation/
│   │   └── AppNavigator.tsx             # createNativeStackNavigator
│   ├── services/
│   │   ├── metalsApi.ts                 # REST fetch (mock/live auto-detect)
│   │   ├── webSocketService.ts          # Singleton WS manager + mock simulator
│   │   ├── goldService.ts               # Gold service class
│   │   ├── silverService.ts             # Silver service with manual retry
│   │   ├── platinumService.ts           # Platinum service with cache strategy
│   │   └── palladiumService.ts          # Palladium with AbortController
│   ├── hooks/
│   │   ├── useGoldPrice.ts              # React Query + auto-refetch every 60s
│   │   ├── useSilverPrice.ts            # Custom hook + manual retry (max 3x)
│   │   ├── usePlatinumPrice.ts          # React Query + cache-first (5min staleTime)
│   │   ├── usePalladiumPrice.ts         # AbortController + 12s timeout
│   │   └── useRealTimePrice.ts          # WebSocket layer — merges ticks into REST data
│   ├── theme/
│   │   ├── colors.ts                    # MetalColors + full UI color palette
│   │   ├── typography.ts                # Font sizes, weights, letter spacing
│   │   ├── spacing.ts                   # Spacing scale + border radius
│   │   ├── shadows.ts                   # Platform-aware elevation shadows
│   │   └── gradients.ts                 # Gradient presets per metal
│   ├── constants/
│   │   └── index.ts                     # API keys, URLs, WebSocket config, metal config
│   ├── utils/
│   │   └── index.ts                     # formatPrice, formatPercent, getMockMetalData
│   └── types/
│       └── index.ts                     # MetalPrice, RootStackParamList, TrendDirection
├── App.tsx                              # Root — QueryClient, Navigation, SafeArea
├── babel.config.js                      # @react-native/babel-preset only
├── react-native.config.js               # Autolinking config (reanimated excluded)
└── tsconfig.json                        # extends @react-native/typescript-config
```

---

## Architecture

### Independent Metal Lifecycle

Each metal has its own complete data stack. A failure in Gold (API down, timeout, network error) never affects Silver, Platinum, or Palladium:

```
Gold     → goldService      → useGoldPrice      → React Query (auto 60s refresh)
                                                    ↓ merged by useRealTimePrice
Silver   → silverService    → useSilverPrice    → Custom hook  (manual retry ×3)
                                                    ↓ merged by useRealTimePrice
Platinum → platinumService  → usePlatinumPrice  → React Query  (cache-first 5min)
                                                    ↓ merged by useRealTimePrice
Palladium→ palladiumService → usePalladiumPrice → Custom hook  (AbortController)
                                                    ↓ merged by useRealTimePrice
                                                    ↓
                              WebSocket (Finnhub / mock simulator)
                              → live ticks overlay price + trigger flash animation
```

### Two-layer Data Model

```
Layer 1 — REST (initial load, error handling, caching)
  metalpriceapi.com → per-metal hooks → MetalCard (displayed price)

Layer 2 — WebSocket (real-time overlay, no error surface)
  Finnhub wss:// or mock simulator
  → useRealTimePrice merges tick into REST data
  → MetalCard flashes green/red on each tick
  → Price bounce animation on tick
```

If WebSocket disconnects, REST data continues to display normally. WebSocket is a silent enhancement, never a blocker.

### Animation Architecture

All animations use React Native's built-in `Animated` API with `useNativeDriver: true` where possible:

- `opacity` and `transform` — native driver (runs on UI thread, 60fps)
- `backgroundColor` flash — plain `useState<string>` updated synchronously (avoids native-driver conflict)
- Entry animations — `Animated.spring` fade + slide per card with staggered delays
- Loader loops — `Animated.loop` + `Animated.sequence`

---

## Installation

### Prerequisites

| Tool | Required Version |
|---|---|
| Node.js | ≥ 18 |
| Java (JDK) | 17 |
| Android Studio | Latest stable |
| Android SDK | API 34+ |
| Android NDK | 27.1.12297006 |
| Android emulator or physical device | API 24+ |

### Environment Setup

If you haven't set up React Native CLI development before, follow the official guide:  
**https://reactnative.dev/docs/set-up-your-environment** — select **React Native CLI** and **Android**.

Key environment variables needed on Windows:

```powershell
# Add to your system environment variables:
ANDROID_HOME = C:\Users\<you>\AppData\Local\Android\Sdk
JAVA_HOME    = C:\Program Files\Java\jdk-17

# Add to PATH:
%ANDROID_HOME%\emulator
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### Clone and Install

```bash
# Navigate to project
cd d:\workspace\Precious_metal

# Install JS dependencies
npm install

# Verify setup
npx react-native doctor
```

---

## Android Setup

### Start an Emulator

Open Android Studio → **Device Manager** → Start an AVD (API 34 recommended).

Or with the CLI:

```bash
# List available emulators
%ANDROID_HOME%\emulator\emulator -list-avds

# Start one
%ANDROID_HOME%\emulator\emulator -avd <AVD_NAME>
```

### Run the App

```bash
# Terminal 1 — start Metro bundler
npx react-native start

# Terminal 2 — build and install on Android
npx react-native run-android
```

Or combined:

```bash
npx react-native run-android
# (Metro starts automatically if not already running)
```

### Port Conflict

If you see `Another process is running on port 8081`:

```bash
# Option A — use a different port
npx react-native run-android --port 8082

# Option B — kill what's on 8081
npx kill-port 8081
npx react-native run-android
```

---

## iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

---

## API Configuration

The app has **two optional API keys**. Both default to mock/demo mode — the app runs fully without either key.

```
src/constants/index.ts   ← the only file you need to edit
```

---

### Key 1 — Metal Price API (REST prices on the cards)

**Provider:** [metalpriceapi.com](https://metalpriceapi.com)  
**Used for:** Card prices, previous close, high/low, % change  
**Free tier:** 50 requests / month  
**Placeholder:** `'YOUR_API_KEY_HERE'`

#### How to get it

1. Go to **https://metalpriceapi.com**
2. Click **Sign Up** (top right) → fill in email + password → verify email
3. You land on the **Dashboard** automatically
4. Your API key is shown at the top of the dashboard page, labelled **"Your API Key"**
5. Click **Copy**

#### Where to paste it

Open [src/constants/index.ts](src/constants/index.ts), **line 8**:

```ts
// BEFORE
export const METAL_PRICE_API_KEY = 'YOUR_API_KEY_HERE';

// AFTER — paste your key between the quotes
export const METAL_PRICE_API_KEY = 'abc123xyz456yourkey';
```

#### What changes in the app

| Before (demo) | After (live key) |
|---|---|
| Card prices are realistic static mock values | Card prices are fetched from metalpriceapi.com |
| `dataSource` shows `"Demo Data"` on Details screen | `dataSource` shows `"MetalPriceAPI"` |
| No network requests made | REST calls fire on load + auto-refresh |

> **Free tier note:** 50 req/month. Gold auto-refreshes every 60s — disable `refetchInterval` in `src/hooks/useGoldPrice.ts` if you want to conserve quota during development.

---

### Key 2 — Finnhub WebSocket (real-time price ticks)

**Provider:** [finnhub.io](https://finnhub.io)  
**Used for:** Live WebSocket price stream — the green/red flash on every tick  
**Free tier:** 60 API calls / minute, WebSocket included  
**Placeholder:** `'YOUR_FINNHUB_KEY_HERE'`

#### How to get it

1. Go to **https://finnhub.io**
2. Click **Get free API key** (centre of homepage) → sign up with email
3. Verify your email
4. Log in → you land on the **Dashboard**
5. Your API key is shown immediately at the top under **"API Key"**
6. Click the copy icon next to it

#### Where to paste it

Open [src/constants/index.ts](src/constants/index.ts), **line 94**:

```ts
// BEFORE
export const FINNHUB_API_KEY = 'YOUR_FINNHUB_KEY_HERE';

// AFTER — paste your key between the quotes
export const FINNHUB_API_KEY = 'def456abc789yourkey';
```

#### What changes in the app

| Before (demo) | After (live key) |
|---|---|
| Status bar shows `DEMO · LIVE` in gold | Status bar shows `LIVE` in green |
| Mock simulator fires a fake tick every 2.5s | Real Finnhub WebSocket stream connects |
| Prices move by ±0.15% randomly | Prices update from real OANDA forex feed |
| No outbound WebSocket connection | Connects to `wss://ws.finnhub.io?token=<key>` |

The WebSocket subscribes to these Finnhub symbols:

| Metal | Symbol |
|---|---|
| Gold | `OANDA:XAU_USD` |
| Silver | `OANDA:XAG_USD` |
| Platinum | `OANDA:XPT_USD` |
| Palladium | `OANDA:XPD_USD` |

---

### Both keys configured — final state of `src/constants/index.ts`

```ts
// ── REST prices ──────────────────────────────────────────────────────────────
export const METAL_PRICE_API_KEY = 'abc123xyz456yourMetalPriceApiKey';

// ── WebSocket real-time stream ────────────────────────────────────────────────
export const FINNHUB_API_KEY = 'def456abc789yourFinnhubKey';
```

Everything else in `src/constants/index.ts` — URLs, symbols, timeouts, cache durations — requires no changes.

---

### Demo Mode (no keys — default)

The app works fully without either key. The detection is automatic:

```ts
// src/services/metalsApi.ts — line 6
const USE_MOCK = METAL_PRICE_API_KEY === 'YOUR_API_KEY_HERE';
```

- If `METAL_PRICE_API_KEY` is still the placeholder → mock REST data loads from `getMockMetalData()` in `src/utils/index.ts`
- If `FINNHUB_API_KEY` is still the placeholder → mock WebSocket simulator runs at 2.5s intervals inside `src/services/webSocketService.ts`

You can run the app in demo mode indefinitely with no network calls and no account needed.

---

## Fetching Strategies per Metal

| Metal | Hook | Strategy | Behavior |
|---|---|---|---|
| **Gold** | `useGoldPrice` | React Query standard | Auto-refetch every 60s, background refresh, retry ×3, staleTime 55s |
| **Silver** | `useSilverPrice` | Custom Axios hook | Manual retry up to ×3 with delay, dedicated error recovery, manual refresh |
| **Platinum** | `usePlatinumPrice` | React Query cache-first | staleTime 5min — serves cache immediately, background sync every visit |
| **Palladium** | `usePalladiumPrice` | Custom hook + AbortController | 12s timeout, request cancellation on unmount, manual refresh |

All 4 are then wrapped by `useRealTimePrice` which overlays live WebSocket ticks without disrupting REST error/loading states.

---

## Deployment Notes

### Building a Release APK

```bash
cd android
.\gradlew.bat assembleRelease
```

Output: `android\app\build\outputs\apk\release\app-release.apk`

For a signed release build, generate a keystore first:

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

Then update `android/app/build.gradle` `signingConfigs.release` with your keystore path and credentials.

### Known Build Requirements

**React Native 0.86 — New Architecture only.**  
This project has `newArchEnabled=true` and `hermesEnabled=true` in `android/gradle.properties`.

`react-native-reanimated` is excluded from native compilation via `react-native.config.js`. RN 0.86 removed the Old Architecture Java APIs (`UIManagerModuleListener`, `LayoutAnimationController`) that Reanimated 3.x compiles against. The app uses the built-in `Animated` API exclusively, so Reanimated is not needed.

**Maven Central access** is required for the first build (downloads `react-android-0.86.0.aar`). The project has Alibaba Maven mirrors configured as fallback in `android/build.gradle` and `android/settings.gradle` for environments where `repo.maven.apache.org` is unreachable.

**Gradle 9.3.1** is auto-downloaded by the Gradle wrapper on first build. Subsequent builds use the cached daemon and are significantly faster.

### Gradle Build Tips

```bash
# Clean build (resolves most Gradle issues)
cd android && .\gradlew.bat clean && cd ..
npx react-native run-android

# Stop all Gradle daemons
cd android && .\gradlew.bat --stop

# Flush DNS if Maven Central is unreachable
ipconfig /flushdns
```

---

## Error Handling Coverage

| Scenario | Behaviour |
|---|---|
| API call fails | Per-metal error card — "Unable to load Gold Price" — with Retry button |
| Network offline | Animated orange banner — "No Internet Connection" — via NetInfo |
| Request timeout | "Request timed out" error card with retry |
| Empty API response | "No data available" empty state illustration |
| WebSocket disconnect | Silent — REST data continues; auto-reconnect with exponential backoff |
| WebSocket unavailable | Auto-switches to built-in mock simulator |
| One metal fails | Other 3 metals continue loading/displaying independently |

---

## Assumptions

1. **Demo mode by default** — app runs without any API key using realistic mock prices
2. **USD pricing** — all prices in USD per troy ounce
3. **Android-first** — developed on Windows; iOS build requires a Mac with Xcode
4. **New Architecture** — built for RN 0.86 New Arch only; Old Arch (Paper) is not supported
5. **Percentage change** — computed against previous close; mock data uses realistic static deltas
6. **WebSocket is enhancement-only** — it overlays ticks but never blocks the REST data flow
7. **No persistent cache across app restarts** — React Query memory cache is session-scoped; MMKV is available as an optional persistent layer
