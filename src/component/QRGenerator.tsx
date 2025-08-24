import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";

export interface ParsedDataType {
  name: string;
  address: string;
  email: string;
  phone: string;
  companyName: string;
}

interface QRGeneratorProps {
  profileData: ParsedDataType | null;
  size?: number;
  backgroundColor?: string;
  foregroundColor?: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({
  profileData,
  size = 200,
  backgroundColor = "#ffffff",
  foregroundColor = "#000000",
}) => {
  if (!profileData || !profileData.name) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No profile data to generate QR</Text>
      </View>
    );
  }

  // Create vCard format for better compatibility with contact apps
  const generateVCard = (data: ParsedDataType): string => {
    console.log("Generating vCard for:", data); // Debug log

    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${data.name || ""}`,
      `N:${data.name || ""};;;`,
      data.email ? `EMAIL:${data.email}` : "",
      data.phone ? `TEL:${data.phone}` : "",
      data.companyName ? `ORG:${data.companyName}` : "",
      data.address ? `ADR:;;${data.address};;;;` : "",
      "END:VCARD",
    ]
      .filter((line) => line !== "" && !line.endsWith(":"))
      .join("\n");

    console.log("Generated vCard:", vCard); // Debug log
    return vCard;
  };

  // Alternative: JSON format (simpler but less compatible with contact apps)
  const generateJSON = (data: ParsedDataType): string => {
    return JSON.stringify(data, null, 2);
  };

  const qrValue = generateJSON(profileData); // Try JSON format instead

  console.log("QR Value being generated (JSON):", qrValue); // Debug log

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile QR Code</Text>
      <Text style={styles.subtitle}>Scan to save contact information</Text>

      <View style={[styles.qrContainer, { backgroundColor }]}>
        <QRCode
          value={qrValue}
          size={size}
          backgroundColor={backgroundColor}
          color={foregroundColor}
          logoSize={30}
          logoBackgroundColor="transparent"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Contains: {profileData.name}
          {profileData.email && ` • ${profileData.email}`}
          {profileData.phone && ` • ${profileData.phone}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  qrContainer: {
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#e9ecef",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    maxWidth: "90%",
  },
  infoText: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});

export default QRGenerator;
