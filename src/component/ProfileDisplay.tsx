import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import QRGenerator from "./QRGenerator"; // Adjust import path as needed

export interface ParsedDataType {
  name: string;
  address: string;
  email: string;
  phone: string;
  companyName: string;
}

interface ProfileDisplayProps {
  profileData?: ParsedDataType;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profileData }) => {
  const [profile, setProfile] = useState<ParsedDataType | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const savedProfile = await AsyncStorage.getItem("userProfile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
      setLoading(false);
    } else {
      loadProfileData();
    }
  }, [profileData]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (!profileData) {
        loadProfileData();
      }
    }, [profileData])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile || !profile.name) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No profile data available</Text>
        <Text style={styles.emptySubtext}>
          Please create your profile first
        </Text>
      </View>
    );
  }

  const ProfileField = ({ label, value }: { label: string; value: string }) => {
    if (!value) return null;

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileContainer}>
        {/* Header with Name */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          {profile.companyName && (
            <Text style={styles.company}>{profile.companyName}</Text>
          )}
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <ProfileField label="Email" value={profile.email} />
          <ProfileField label="Phone" value={profile.phone} />
          <ProfileField label="Address" value={profile.address} />
        </View>

        {/* QR Code Section */}
        <QRGenerator profileData={profile} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  profileContainer: {
    flex: 1,
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginBottom: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
});

export default ProfileDisplay;
