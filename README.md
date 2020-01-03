## Development

```sh
npm i
# You may run into this issue so follow these steps
# This is a bug in react-native
# https://forums.expo.io/t/pod-install-errors-on-newly-detached-app-on-macos-installing-glog-bin-bash-configure-bin-sh-m-bad-interpreter-no-such-file-or-directory/10054/10
# You can find ios-configure-glog.sh in
# ./node_modules/react-native/scripts/
cd ios && pod install && cd .. # If you are on Mac
npx expo start -c
```

Open ios/510-data-collect.xcworkspace in Xcode and run it.

The app has been ejected from expo and still uses ExpoKit.

## Tech stack

- [React native](https://facebook.github.io/react-native/)
- [Expo](https://expo.io/)
- [React Navigation](https://reactnavigation.org/en/)
- [ApolloGraphql](https://www.apollographql.com/docs/react/)
