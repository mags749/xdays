# XDays — Upgrade Notes

## Summary of Changes

### 1. React Native 0.77.2 → 0.79.2
- Updated `react-native`, `@react-native/babel-preset`, `@react-native/eslint-config`,
  `@react-native/metro-config`, `@react-native/typescript-config` to `0.79.2`.
- Updated `@react-native-community/cli` and platform packages to `18.0.0`.
- RN 0.79 uses a new build system (Re.Pack optional, Gradle 8+) and ships with
  full **16 KB memory page size** support on Android — the JSI SQLite adapter in
  WatermelonDB also builds with 16 KB alignment, resolving the page-size issue.

### 2. React 18.3.1 → 19.0.0
- Updated `react`, `react-test-renderer`, and `@types/react` to `19.0.0`.
- React 19 removes legacy APIs (`ReactDOM.render`, string refs, etc.) — none were
  used in this codebase, so no component changes were needed.

### 3. Vasern → WatermelonDB
Vasern is unmaintained and does not support 16 KB page sizes or current NDK.
WatermelonDB (`@nozbe/watermelondb ^0.27.1`) replaces it with:

| Old (Vasern) | New (WatermelonDB) |
|---|---|
| `new Vasern({ schemas, version })` | `new Database({ adapter, modelClasses })` |
| `Days.data()` | `getDaysCollection().query().fetch()` |
| `Days.onChange(cb)` | `observeDays().subscribe(cb)` (RxJS) |
| `Days.insert(record)` | `insertDay(record)` |
| `Days.remove(id, true)` | `removeDay(id)` |

**New files added:**
- `src/db/schema/index.js` — WatermelonDB `appSchema` + `tableSchema` for `days`
- `src/db/models/Day.js` — `Day` model class with `@field` decorators
- `src/db/migrations.js` — migration scaffold (empty at v1, extend for future changes)
- `src/db/index.js` — database init + `observeDays`, `insertDay`, `removeDay` helpers

**Deleted:** `src/db/schema/Day.js` (Vasern schema format)

### 4. Navigation (react-navigation v6 → v7)
- `@react-navigation/native` and `@react-navigation/native-stack` bumped to v7.
- No API changes required in `App.jsx` — the v7 stack API is backward compatible.

### 5. Other dependency bumps
| Package | Old | New |
|---|---|---|
| `react-native-gesture-handler` | ^2.14.1 | ^2.24.0 |
| `react-native-screens` | ^3.29.0 | ^4.10.0 |
| `react-native-date-picker` | ^4.3.5 | ^5.0.10 |

### 6. Babel config
Added decorator support required by WatermelonDB `@field` / `@date` syntax:
```js
plugins: [
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-transform-class-properties', { loose: true }],
]
```
New devDependencies: `@babel/plugin-proposal-decorators`, `@babel/plugin-transform-class-properties`.

---

## Post-upgrade steps

### Android
1. Update `android/build.gradle` → Gradle plugin `8.5.x` (required for RN 0.79).
2. Update `android/gradle/wrapper/gradle-wrapper.properties` → Gradle `8.10.x`.
3. Ensure `android/gradle.properties` contains:
   ```
   android.useAndroidX=true
   android.enableJetifier=true
   ```
4. The WatermelonDB SQLite adapter ships a pre-built `.so` that already supports
   16 KB memory pages — no additional NDK flags are needed.

### iOS
1. Run `bundle install` then `bundle exec pod install` inside `/ios`.
2. Minimum iOS deployment target should be **15.1** for RN 0.79.
3. In Xcode, confirm `IPHONEOS_DEPLOYMENT_TARGET = 15.1` in the project settings.

### General
```bash
# Remove old lock file & node_modules, then reinstall
rm -rf node_modules yarn.lock
yarn install
```
