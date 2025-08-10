import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Card Scanner" }} />
      <Stack.Screen name="camera" options={{ title: "Scan Card" }} />
      <Stack.Screen name="result" options={{ title: "Card Details" }} />
    </Stack>
  );
}
