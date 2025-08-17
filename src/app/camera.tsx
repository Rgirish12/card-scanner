import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { LoadingSpinner } from "src/component/loadingSpinner";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission(); // ask on first load
    }
  }, [permission]);

  if (!permission?.granted) {
    return (
      <View
        style={{
          flex: 1,
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CameraView style={{ flex: 1 }} />
        <View style={{ position: "absolute", top: 50, left: 10 }}>
          <Text style={{ fontSize: 16, color: "white" }}>
            Camera permission is required
          </Text>
          <Button title="Allow Camera Access" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true, // ✅ Include base64 in the result
        quality: 0.7, // optional, compress image
      });

      if (photo) {
        setIsProcessing(false);
        console.log("photo", photo);
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
    try {
      setIsProcessing(true); // ✅ show loader while picking

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
      } else {
        setIsProcessing(false); // ✅ user cancelled, hide loader
      }
    } catch (error) {
      console.error("Image picking error:", error);
      setIsProcessing(false); // ✅ reset if something fails
    }
  };

  // if (isProcessing) {
  //   return (
  //     // <View style={styles.centeredContainer}>
  //     // <Text style={styles.bigText}>Setting things up...</Text>
  //     <LoadingSpinner message="Setting things up" />
  //     // </View>
  //   );
  // }
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

      {/* 🔹 Overlay loader */}
      {isProcessing && (
        <View style={styles.overlay}>
          <LoadingSpinner message="Setting things up..." />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bigText: { fontSize: 24, color: "black" },
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
