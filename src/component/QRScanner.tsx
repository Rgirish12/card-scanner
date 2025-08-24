import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export interface ParsedDataType {
  name: string;
  address: string;
  email: string;
  phone: string;
  companyName: string;
}

type RootStackParamList = {
  result: { profileData: string };
};

const QRScanner: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  // Parse vCard format
  const parseVCard = (vCardData: string): ParsedDataType | null => {
    try {
      console.log("vCard data to parse:", vCardData);

      const lines = vCardData.split("\n").map((line) => line.trim());
      const parsedData: ParsedDataType = {
        name: "",
        address: "",
        email: "",
        phone: "",
        companyName: "",
      };

      lines.forEach((line) => {
        console.log("Processing line:", line);

        if (line.startsWith("FN:")) {
          parsedData.name = line.substring(3).trim();
        } else if (line.startsWith("EMAIL:")) {
          parsedData.email = line.substring(6).trim();
        } else if (line.startsWith("TEL:")) {
          parsedData.phone = line.substring(4).trim();
        } else if (line.startsWith("ORG:")) {
          parsedData.companyName = line.substring(4).trim();
        } else if (line.startsWith("ADR:")) {
          // ADR format: ;;street;city;state;postal;country
          const addressParts = line.substring(4).split(";");
          if (addressParts.length > 2) {
            const addressComponents = addressParts
              .slice(2)
              .filter((part) => part.trim());
            parsedData.address = addressComponents.join(", ");
          }
        }
      });

      console.log("Final parsed vCard data:", parsedData);

      // Ensure we have at least a name
      if (!parsedData.name || parsedData.name.trim() === "") {
        console.log("No name found in vCard");
        return null;
      }

      return parsedData;
    } catch (error) {
      console.error("Error parsing vCard:", error);
      return null;
    }
  };

  // Parse JSON format (backup)
  const parseJSON = (jsonData: string): ParsedDataType | null => {
    try {
      console.log("JSON data to parse:", jsonData);

      const parsed = JSON.parse(jsonData);
      console.log("Parsed JSON object:", parsed);

      // Validate that it has the expected structure
      if (typeof parsed === "object" && parsed !== null) {
        const result: ParsedDataType = {
          name: (parsed.name || "").toString().trim(),
          address: (parsed.address || "").toString().trim(),
          email: (parsed.email || "").toString().trim(),
          phone: (parsed.phone || "").toString().trim(),
          companyName: (parsed.companyName || "").toString().trim(),
        };

        console.log("Final parsed JSON data:", result);

        // Ensure we have at least a name
        if (!result.name) {
          console.log("No name found in JSON");
          return null;
        }

        return result;
      }

      console.log("Invalid JSON structure");
      return null;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    console.log("Raw scanned data:", data);
    console.log("Data length:", data.length);
    console.log("First 50 characters:", data.substring(0, 50));

    try {
      let parsedData: ParsedDataType | null = null;

      // First, trim the data
      const trimmedData = data.trim();

      // Check for vCard format first (most reliable check)
      if (trimmedData.includes("BEGIN:VCARD")) {
        console.log("✅ Detected vCard format");
        parsedData = parseVCard(trimmedData);
      }
      // Only try JSON if it clearly looks like JSON
      else if (trimmedData.startsWith("{") && trimmedData.endsWith("}")) {
        console.log("✅ Detected JSON format");
        parsedData = parseJSON(trimmedData);
      }
      // Handle other formats or give specific error
      else {
        console.log("❌ Unknown format detected");
        console.log("Data starts with:", trimmedData.substring(0, 20));
        console.log(
          "Data ends with:",
          trimmedData.substring(trimmedData.length - 20)
        );

        Alert.alert(
          "Unsupported QR Code",
          "This QR code format is not supported. Please scan a profile QR code generated by this app.",
          [
            {
              text: "Try Again",
              onPress: () => {
                setScanned(false);
                setIsProcessing(false);
              },
            },
          ]
        );
        return;
      }

      console.log("Final parsed data:", parsedData);

      if (parsedData && parsedData.name && parsedData.name.trim() !== "") {
        console.log("✅ Successfully parsed, navigating to result");
        navigation.navigate("result", {
          profileData: JSON.stringify(parsedData),
        });
      } else {
        console.log("❌ Parsing failed or no name found");
        Alert.alert(
          "Invalid Profile Data",
          "Could not extract valid profile information from this QR code.",
          [
            {
              text: "Try Again",
              onPress: () => {
                setScanned(false);
                setIsProcessing(false);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("❌ Error processing QR code:", error);
      Alert.alert("Scanning Error", `Failed to process QR code: ${error}`, [
        {
          text: "Try Again",
          onPress: () => {
            setScanned(false);
            setIsProcessing(false);
          },
        },
      ]);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>Camera permission denied</Text>
        <Text style={styles.permissionSubtext}>
          Please enable camera access in settings to scan QR codes
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={getCameraPermissions}
        >
          <Text style={styles.retryButtonText}>Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        {/* Overlay with scan area */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay}>
            <Text style={styles.instructionText}>
              {isProcessing
                ? "Processing..."
                : "Point your camera at a QR code"}
            </Text>
            <Text style={styles.subInstructionText}>
              The QR code will be scanned automatically
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const scanAreaSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  permissionSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  middleRow: {
    flexDirection: "row",
    height: scanAreaSize,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  scanArea: {
    width: scanAreaSize,
    height: scanAreaSize,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#fff",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  instructionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subInstructionText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
  },
});

export default QRScanner;
