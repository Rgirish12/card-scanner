import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";

const RoutIndex = () => {
  return <Redirect href="/(tabs)/cards" />;
};

export default RoutIndex;
