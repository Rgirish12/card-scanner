import { View, Text } from "react-native";
import React from "react";
import ProfileForm from "src/component/ProfileForm";
import ProfileDisplay from "src/component/ProfileDisplay";
import { Link } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginVertical: 20,
          }}
        >
          My Profile
        </Text>
        <Link asChild href="/(tabs)/profile/edit">
          <Feather name="edit-2" size={24} color="black" />
        </Link>
      </View>
      <ProfileDisplay />
    </SafeAreaView>
  );
};

export default index;
