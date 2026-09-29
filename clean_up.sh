#!/bin/bash

echo "🧹 Starting deep clean for Expo & Android..."

# 1. Clear Expo & Metro bundler caches
echo "👉 Clearing Metro and Expo caches..."
rm -rf "${TMPDIR:-/tmp}"/metro-cache*
rm -rf "${TMPDIR:-/tmp}"/haste-map-*
rm -rf .expo
watchman watch-del-all 2>/dev/null

# 2. Remove node_modules
echo "👉 Removing node_modules..."
rm -rf node_modules

# 3. Remove generated native projects (recreated by `expo prebuild`)
if [ -d "android" ] || [ -d "ios" ]; then
    echo "👉 Removing generated native folders..."
    (cd android 2>/dev/null && ./gradlew --stop)
    rm -rf android ios
fi

echo "✅ Cleanup complete! Reinstalling dependencies..."
npm install
echo "👉 Run 'npx expo prebuild --clean' or 'npx expo run:android' to regenerate native projects."
