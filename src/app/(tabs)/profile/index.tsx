import { View, Text } from "react-native";
import React from "react";
import ProfileForm from "src/component/ProfileForm";
import ProfileDisplay from "src/component/ProfileDisplay";

const index = () => {
  return (
    <View style={{ flex: 1 }}>
      <ProfileDisplay />
    </View>
  );
};

export default index;
