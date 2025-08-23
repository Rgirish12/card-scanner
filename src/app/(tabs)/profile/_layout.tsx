import { View, Text } from "react-native";
import React from "react";
import { Link, router, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";

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
          title: "My Profile",
          // headerBackVisible: false,
          headerRight: () => (
            <Link asChild href="/(tabs)/profile/edit">
              <Feather name="edit-2" size={24} color="black" />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit profile",
        }}
      />
    </Stack>
  );
};

export default KnowledgeBaseStack;
