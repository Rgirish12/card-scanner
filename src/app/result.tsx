import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tesseract from "tesseract.js";
import { extractBusinessCardInfo } from "src/utils/ocrService";
import { ParsedDataType } from "src/types";

export default function ResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [extractedText, setExtractedText] = useState<string>("");
  const [parsedData, setParsedData] = useState<ParsedDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleExtract = async () => {
    const result = await extractBusinessCardInfo(imageUri);

    setIsLoading(false);
    setParsedData(result);
  };

  useEffect(() => {
    if (imageUri) {
      handleExtract();
    }
  }, [imageUri]);

  const saveCard = async () => {
    const cardData = {
      id: Date.now().toString(),
      ...parsedData,
      rawText: extractedText,

      timestamp: new Date().toISOString(),
    };

    try {
      const existingCards = await AsyncStorage.getItem("scannedCards");
      const cards = existingCards ? JSON.parse(existingCards) : [];
      cards.push(cardData);
      await AsyncStorage.setItem("scannedCards", JSON.stringify(cards));

      Alert.alert("Success", "Card saved successfully!", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save card");
    }
  };

  if (isLoading || parsedData === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Processing image...</Text>
        <Text style={styles.loadingSubText}>
          Extracting text using Tesseract OCR
        </Text>
        <Text style={styles.loadingNote}>This may take 10-30 seconds</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Extracted Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{parsedData.name || "Not found"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Company Name:</Text>
          <Text style={styles.value}>
            {parsedData.companyName || "Not found"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={[styles.value, styles.emailText]}>
            {parsedData.email || "Not found"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={[styles.value, styles.phoneText]}>
            {parsedData.phone || "Not found"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{parsedData.address || "Not found"}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveCard}>
        <Text style={styles.saveButtonText}>Save Card</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  loadingNote: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 10,
  },
  section: {
    margin: 20,
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  label: {
    fontWeight: "bold",
    width: 80,
    color: "#555",
  },
  value: {
    flex: 1,
    color: "#333",
    lineHeight: 20,
  },
  emailText: {
    color: "#007AFF",
  },
  phoneText: {
    color: "#28a745",
  },
  rawText: {
    backgroundColor: "#e9ecef",
    padding: 15,
    borderRadius: 8,
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
