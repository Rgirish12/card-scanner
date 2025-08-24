import * as SplashScreen from "expo-splash-screen";
import { View, Text } from "react-native";

import React from "react";
import { Redirect } from "expo-router";
SplashScreen.preventAutoHideAsync();
const RoutIndex = () => {
  SplashScreen.hideAsync();

  return <Redirect href="/(tabs)" />;
};

export default RoutIndex;
