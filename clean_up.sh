#!/bin/bash

echo "🧹 Starting deep clean for Expo & Android..."

# 1. Clear Expo & Metro Bundler Cache
echo "👉 Clearing Metro and Expo caches..."
rm -rf $TMPDIR/metro-cache*
rm -rf $TMPDIR/haste-map-*
watchman watch-del-all 2>/dev/null

# 2. Clear Node Modules & Reinstall (Optional but recommended)
echo "👉 Removing node_modules and clearing package manager cache..."
rm -rf node_modules
rm -rf ~/.pnpm-store
rm -rf ~/.gradle/wrapper/dists/*
pnpm store prune

# 3. Clear Local Android Build Files
if [ -d "android" ]; then
    echo "👉 Cleaning local Android build artifacts..."
    cd android
    # Remove the generated android build folder and the C++ cache
    rm -rf app/build
    rm -rf .gradle
    rm -rf app/.cxx
    ./gradlew clean
    ./gradlew --stop # Stop Gradle Daemons
    cd ..
fi

# 4. Clear Global Gradle Cache (Use with caution - affects all projects)
echo "👉 Clearing global Gradle caches..."
rm -rf ~/.gradle/caches/

# 5. Expo/EAS specific cache clear
echo "👉 Preparing for fresh Expo start..."
# This clears the bundler cache and starts the server
# npx expo start --clear

echo "✅ Cleanup complete! Reinstalling dependencies..."
pnpm i
