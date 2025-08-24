import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          paddingTop: 2,
          height: 56,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontFamily: "Nunito-Semi",
          letterSpacing: 0.9,
          fontSize: 10,
        },
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="cards"
        options={{
          tabBarLabel: "Cards",
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="credit-card" size={24} color="black" />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="user-o" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
