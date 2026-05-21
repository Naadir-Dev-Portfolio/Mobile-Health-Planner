---
<div align="center">

<img src="./repo-card.png" alt="Mobile-Health-Planner project card" width="100%" />
<br /><br />

<p><strong>Mobile version of custom workout plan library built in React Native and HTML CSS & Javascript via webview.</strong></p>

<p>Built for people who want fast mobile access to structured workout plans without opening separate files, browsers, or cloud tools.</p>

<p>
  <a href="#overview">Overview</a> |
  <a href="#what-problem-it-solves">What It Solves</a> |
  <a href="#feature-highlights">Features</a> |
  <a href="#screenshots">Screenshots</a> |
  <a href="#quick-start">Quick Start</a> |
  <a href="#tech-stack">Tech Stack</a>
</p>

<h3><strong>Made by Naadir | February 2026</strong></h3>

</div>

---

## Overview

Mobile Health Planner is a React Native and Expo mobile app that turns local workout HTML files into a clean routine browser. It packages workout plans into the app, lists them in a searchable library, and opens each plan inside a WebView.

The app supports a simple health-planning workflow: open the home screen, browse available routines, search by routine name or code, select a plan, then view the full workout without leaving the app. It also includes a static supplement-plan screen for demo use.

The practical outcome is a mobile-first workout reference system that keeps routines easy to access, fast to search, and available as bundled local content. This public version is sanitized for portfolio sharing and removes private regimen data, private generated source folders, and Expo cloud identifiers.

## What Problem It Solves

- Removes the friction of digging through separate workout files on mobile.
- Replaces manual browser-based viewing with an in-app WebView routine viewer.
- Makes the workout library easier to search, open, and compare by routine code or title.
- Gives a cleaner public-safe version compared with a private local workflow that depends on generated personal data.

### At a glance

| Track | Analyse | Compare |
|---|---|---|
| Bundled workout HTML files | Asset loading and WebView render state | Workout plans by routine code and title |
| Selected routine and supplement screen | Search matches, route state, and viewer behaviour | Active routine vs full routine library |
| Local bundled assets and demo schedule | Mobile screen output through list and WebView views | Static public demo content vs private generated source content |

## Feature Highlights

- **Workout browser**, lists bundled routine files from a static asset manifest so plans are easy to scan on mobile.
- **Search filter**, narrows routines by code or title so the right workout can be opened quickly.
- **WebView workout viewer**, renders local HTML workout plans inside the native app shell.
- **Zoom controls**, lets the user adjust workout page scale for better readability.
- **Deep-link routes**, supports navigation into home, workouts, and supplement-plan screens.
- **Sanitized demo regimen**, replaces private personal-care data with public-safe static examples.

### Core capabilities

| Area | What it gives you |
|---|---|
| **Workout library** | A searchable mobile list of bundled workout plans. |
| **Routine viewer** | In-app HTML rendering through WebView without opening an external browser. |
| **Supplement demo** | A static public-safe supplement schedule for portfolio demonstration. |
| **Mobile shell** | Expo-compatible Android and iOS testing through a native React Native structure. |

## Screenshots

<details>
<summary><strong>Open screenshot gallery</strong></summary>

<br />

<div align="center">
  <img src="./portfolio/Screen1.png" alt="Mobile Health Planner home screen" width="88%" />
  <br /><br />
  <img src="./portfolio/Screen2.png" alt="Mobile Health Planner workout list" width="88%" />
  <br /><br />
  <img src="./portfolio/Screen3.png" alt="Mobile Health Planner workout viewer" width="88%" />
</div>

</details>

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Naadir-Dev-Portfolio/Mobile-Health-Planner.git
cd Mobile-Health-Planner

# Install dependencies
npm install

# Run
npx expo start
```

Open the project in Expo Go or an Expo-supported simulator. No API keys are required for the public demo.

## Tech Stack

<details>
<summary><strong>Open tech stack</strong></summary>

<br />

| Category | Tools |
|---|---|
| **Primary stack** | `React Native` | `HTML` | `CSS` | `Javascript` |
| **UI / App layer** | `Expo` | `React Native views` | `FlatList` | `react-native-webview` |
| **Data / Storage** | Bundled local HTML files, static TypeScript asset manifest, static demo regimen data |
| **Automation / Integration** | Expo Asset loading, WebView rendering, deep-link handling |
| **Platform** | Android, iOS, and Expo development workflow |

</details>

## Architecture & Data

<details>
<summary><strong>Open architecture and data details</strong></summary>

<br />

### Application model

The app starts in `App.tsx`, which controls the home screen, workout library, and supplement-plan screen. Workout metadata is loaded from `workouts.generated.ts`, local HTML workout files are resolved through Expo Asset, and the selected routine is passed into a WebView for mobile rendering. Search state filters the routine list before selection, while route state controls which screen is active.

### Project structure

```text
Mobile-Health-Planner/
+-- App.tsx
+-- workouts.generated.ts
+-- regimen.bundle.ts
+-- assets/
|   +-- workouts/
+-- README.md
+-- repo-card.png
+-- portfolio/
    +-- mobile-health-planner.json
    +-- mobile-health-planner.webp
    +-- Screen1.png
    +-- Screen2.png
    +-- Screen3.png
```

### Data / system notes

- Workout plans are static bundled HTML assets loaded locally through Expo.
- Personal regimen and hair-care data has been removed from the public version.
- No Expo cloud project ID, private build path, generated private source folder, or API key is required.

</details>

## Contact

Questions, feedback, or collaboration: `naadir.dev.mail@gmail.com`

<sub>React Native | HTML | CSS | Javascript</sub>
