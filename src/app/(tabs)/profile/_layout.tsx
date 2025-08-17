import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const KnowledgeBaseStack = () => {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        headerTitleStyle: {
          fontFamily: "Nunito-Semi",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My knowledge base",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="qr"
        options={{
          title: "Add to knowledge base",
        }}
      />
    </Stack>
  );
};

export default KnowledgeBaseStack;
