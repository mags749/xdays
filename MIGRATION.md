# XDays — Upgrade Migration Notes

## Versions
| | Before | After |
|---|---|---|
| react | 18.3.1 | **19.0.0** |
| react-native | 0.77.2 | **0.79.2** |
| Database | vasern 0.3.68 | **@nozbe/watermelondb 0.27.1** |
| @react-native-community/cli | 15.0.1 | **18.0.0** |
| @react-navigation/* | v6 | **v7** |
| react-native-screens | 3.x | **4.x** |

---

## 1. 16 KB Memory Page Size (Android 15+)

React Native 0.79 targets the new Android 15 requirement where apps must support
16 KB memory page alignment. The following changes enable this:

### android/app/build.gradle
Add inside the `android { }` block:
```groovy
android {
    ...
    // 16 KB page-size alignment required for Android 15+ (API 35)
    packagingOptions {
        jniLibs {
            useLegacyPackaging = false
        }
    }
    defaultConfig {
        ...
        externalNativeBuild {
            cmake {
                arguments "-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON"
            }
        }
    }
}
```

### android/CMakeLists.txt (if present)
```cmake
# Support 16 KB page sizes
target_link_options(${PACKAGE_NAME} PRIVATE "-Wl,-z,max-page-size=16384")
```

> **Note:** React Native 0.79's bundled native libraries (JSC / Hermes) are
> already compiled with 16 KB alignment. The flags above apply to any custom
> C/C++ native code in the project.

---

## 2. Vasern → WatermelonDB

### Why WatermelonDB?
- Vasern is unmaintained and uses 4 KB-aligned SQLite, incompatible with Android 15's 16 KB requirement.
- WatermelonDB uses a JSI SQLite adapter that is 16 KB-aligned and actively maintained.
- Lazy loading and Observable streams replace Vasern's `onChange` event model.

### New file structure
```
src/db/
  index.js            ← database instance + helpers (insertDay, removeDay, observeDays, fetchDays)
  models/
    Day.js            ← WatermelonDB Model class
  schema/
    Day.js            ← tableSchema (replaces Vasern props object)
```

### API mapping
| Old (Vasern) | New (WatermelonDB) |
|---|---|
| `Days.data()` | `await fetchDays()` |
| `Days.onChange(cb)` | `observeDays().subscribe(...)` |
| `Days.insert(record)` | `await insertDay(record)` |
| `Days.remove(id, true)` | `await removeDay(idOrRecord)` |

### Timestamp storage
WatermelonDB stores all numbers as SQLite `REAL`. Timestamps are stored as
Unix milliseconds (`Date.getTime()`) in the `timestamp` column and converted
back to `Date` objects when needed: `new Date(day.timestamp)`.

---

## 3. Required Native Setup

### Android — android/app/build.gradle
```groovy
dependencies {
    // WatermelonDB JSI SQLite
    implementation project(':watermelondb')
    implementation "com.facebook.react:react-native:+"
}
```

WatermelonDB auto-links via React Native's autolinking. Run:
```bash
cd android && ./gradlew clean
```

### iOS — ios/Podfile
```ruby
# Needed for WatermelonDB JSI
pod 'WatermelonDB', :path => '../node_modules/@nozbe/watermelondb'
```
Then:
```bash
cd ios && bundle exec pod install
```

---

## 4. Babel Plugins

`babel.config.js` now includes:
```js
plugins: [
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-proposal-class-properties', { loose: true }],
]
```
These are required for WatermelonDB's `@field`, `@date`, and other decorator
annotations used in `src/db/models/Day.js`.

Install the extra plugin:
```bash
yarn add -D @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
```

---

## 5. Notification Logic

The original Vasern `onChange → insert` event no longer applies because
WatermelonDB's observable fires _after_ the database write. Notification
scheduling has been moved directly into `DayScreen.saveData()` immediately
after `insertDay()`, preserving identical behaviour.

---

## 6. Upgrade Steps (full)

```bash
# 1. Install dependencies
yarn install

# 2. Android
cd android && ./gradlew clean && cd ..

# 3. iOS
cd ios && bundle exec pod install && cd ..

# 4. Clear Metro cache
yarn start --reset-cache
```
