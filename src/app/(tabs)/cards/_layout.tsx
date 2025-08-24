import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{ animation: "slide_from_right", headerShown: false }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Card Scanner",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen name="camera" options={{ title: "Scan Card" }} />
      <Stack.Screen name="qr-scanner" options={{ title: "Scan QR" }} />
      <Stack.Screen name="result" options={{ title: "Card Details" }} />
    </Stack>
  );
}
