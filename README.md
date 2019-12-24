# ECA-ReactNativeApp
Mobile frontend for the event communications apps


## Building apps:


### Android debug:
Follow the **React Native CLI Quickstart** steps for Android here:\
https://facebook.github.io/react-native/docs/getting-started.html \
(skip the **Creating a new application** section)\
Then attach an android device with usb in debug mode and run\
`react-native run-android`

### Android Production:
`cd android`\
run `./gradlew assembleRelease`

Apk will be generated in `/android/app/build/outputs/apk/release`.


### iOS debug: 
`yarn` (to install node modules)\
then open `ios/NativeProject.xcworkspace` with Xcode and press the play button.

### iOS production: 
select product -> Archive from top menu
