import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileForm from "src/component/ProfileForm";

export interface ParsedDataType {
  name: string;
  address: string;
  email: string;
  phone: string;
  companyName: string;
}

const Edit = () => {
  const [profileData, setProfileData] = useState<ParsedDataType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const savedProfile = await AsyncStorage.getItem("userProfile");
      if (savedProfile) {
        const parsedProfile: ParsedDataType = JSON.parse(savedProfile);
        setProfileData(parsedProfile);
      } else {
        // If no profile exists, set empty data
        setProfileData({
          name: "",
          address: "",
          email: "",
          phone: "",
          companyName: "",
        });
      }
    } catch (err) {
      console.error("Error loading profile data:", err);
      setError("Failed to load profile data");
      // Set empty data as fallback
      setProfileData({
        name: "",
        address: "",
        email: "",
        phone: "",
        companyName: "",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileForm initialData={profileData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default Edit;
