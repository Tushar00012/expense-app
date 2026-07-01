# Expense Diary

![Expense Diary app icon](./assets/favicon.png)

Expense Diary is a mobile-first personal expense tracker built with Expo Router, React Native, Zustand, and SQLite. It is designed for quick daily entry, simple history lookup, and lightweight spending analytics.

## Overview

- Track expenses with amount, category, payment method, note, date, and time.
- Support both `cash` and `upi` payments, including a selected UPI app.
- View a dashboard with today and this week summaries.
- Explore analytics by week, month, year, or all-time.
- Search and filter expense history by keyword, category, and payment method.
- Persist data locally with SQLite so entries remain on-device.

## Tech Stack

- Expo SDK `57.0.0`
- React Native `0.86.0`
- React `19.2.3`
- Expo Router for navigation
- React Native Paper for UI primitives and theming
- Zustand for app state
- Expo SQLite for local persistence
- `react-native-gifted-charts` for analytics charts

## App Flow

The app uses a tab-based structure:

- `Home`: summary cards and recent expenses
- `Add`: expense entry form
- `Analytics`: period-based charts and top categories
- `History`: grouped list with search and filters

Expenses are inserted into SQLite and mirrored into a Zustand store for rendering. Screens refresh from storage on focus, which keeps the UI aligned with the local database.

## Project Analysis

### Strengths

- Clear separation between routing, state, database access, constants, and UI components.
- Local-first storage avoids any backend dependency.
- Analytics are simple and useful for a single-user offline app.
- The add-expense flow is fast and optimized for repeated daily use.
- The theme and category system already provide a consistent visual language.

### Current Limitations

- No edit/update flow for an existing expense; only add and delete are implemented.
- Validation is intentionally basic and mostly focused on amount entry.
- History category quick filters expose only a subset of categories on screen.
- There is no sync, backup, authentication, or export/import flow.
- No automated test suite is present in the repository.

### Architecture Notes

- `app/`: Expo Router screens and layouts
- `src/store/`: Zustand state and selectors
- `src/db/`: SQLite initialization and query helpers
- `src/components/`: reusable UI blocks
- `src/constants/`: theme, category, and UPI metadata
- `src/utils/`: formatting, chart transforms, and mock data helpers

The database schema is intentionally small: one `expenses` table with indexes for `date` and `created_at`. That keeps reads cheap for dashboard and history views while remaining easy to evolve.

## Getting Started

This project should be run against Expo SDK 57 conventions. The versioned Expo docs are here:

- https://docs.expo.dev/versions/v57.0.0/

### Prerequisites

- Node.js `22.13.x` or newer in the Expo SDK 57 line
- npm
- Xcode for iOS builds
- Android Studio for Android builds

### Install

```bash
npm install
```

### Run

```bash
npm run start
```

```bash
npm run ios
```

```bash
npm run android
```

```bash
npm run web
```

## Project Structure

```text
app/
  (tabs)/
    index.tsx
    add.tsx
    analytics.tsx
    history.tsx
src/
  components/
  constants/
  db/
  store/
  types/
  utils/
assets/
```

## Images Used

The current repository includes these image assets:

- `assets/favicon.png`: primary app icon used in `app.json` for app/web branding
- `assets/icon.png`: general app icon asset
- `assets/splash-icon.png`: splash artwork asset
- `assets/android-icon-foreground.png`: Android adaptive foreground layer
- `assets/android-icon-background.png`: Android adaptive background asset
- `assets/android-icon-monochrome.png`: Android monochrome icon asset

All listed image files are already present in the repo. The configured app icon and splash setup currently point at `./assets/favicon.png`.

## Possible Next Improvements

- Add expense editing
- Add category management
- Add backup/export to CSV or JSON
- Add budget targets and alerts
- Add tests for store selectors and database queries

## License

This project is licensed under the [MIT License](./LICENSE).
