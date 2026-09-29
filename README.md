# Xdays

Open source day counter mobile app. Free to use, copy and share.

## Technologies used

- [Expo SDK 55](https://expo.dev/) with [React Native](https://reactnative.dev/) 0.83 and [React](https://react.dev/) 19.2 (New Architecture)
- Routing done using [React Navigation](https://reactnavigation.org/) v7
- [Tabler](https://tabler.io/) Icon [library](https://github.com/50UM3N/tabler-icons-react-native)
- [Tailwind](https://tailwindcss.com/) with [NativeWind](https://www.nativewind.dev/) v4 for Styling
- Local storage with [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- Reminders with [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Date FNS](https://date-fns.org/) for date manipulation

## Setup

1. Install the dependencies

```bash
npm install
```

2. Build and run a development build (required: `react-native-date-picker` is a
   native module that isn't bundled in Expo Go)

```bash
npx expo run:android
# or
npx expo run:ios
```

3. On later runs, start only the dev server

```bash
npx expo start --dev-client
```

## Available commands

- `npm start`: Start the Expo dev server.
- `npm run android` / `npm run ios`: Build and run the native app locally.
- `npm run lint`: Run linter.
- `npm run format`: Run prettier.
- `npm test`: Run tests.
- `npm run typecheck`: Run TypeScript.
- `npx expo-doctor`: Check the project for common issues.
- `npx expo prebuild --clean`: Regenerate `android/` and `ios/` (they are git-ignored).
