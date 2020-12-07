#!/bin/bash

react-native bundle --entry-file index.js --platform android --dev false --bundle-output ./android/app/src/main/assets/index.android.bundle
cd android
./gradlew assembleRelease
adb install -r ./app/build/outputs/apk/release/app-release.apk
cd ..