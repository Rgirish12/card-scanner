import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission?.granted) {
    return (
      // ✅ Correct - use absolute positioning instead
      <View style={{ position: "relative" }}>
        <CameraView />
        <Text style={{ position: "absolute", top: 10, left: 10 }}>
          Some content
        </Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true, // ✅ Include base64 in the result
        quality: 0.7, // optional, compress image
      });

      if (photo) {
        router.replace({
          pathname: "/result",
          params: {
            imageUri: photo.base64,
          },
        });
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      router.replace({
        pathname: "/result",
        params: { imageUri: result.assets[0].base64 },
      });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.text}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              setFacing((current) => (current === "back" ? "front" : "back"))
            }
          >
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 50,
  },
  button: { backgroundColor: "rgba(0,0,0,0.5)", padding: 15, borderRadius: 10 },
  captureButton: { backgroundColor: "#007AFF", padding: 20, borderRadius: 50 },
  text: { fontSize: 18, fontWeight: "bold", color: "white" },
});
