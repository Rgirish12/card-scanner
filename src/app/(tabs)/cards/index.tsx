import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Link, router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

interface CardData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  rawText: string;
  timestamp: string;
}

export default function HomeScreen() {
  const [cards, setCards] = useState<CardData[]>([]);
  const isScreenFocused = useIsFocused();
  useEffect(() => {
    loadCards();
  }, [isScreenFocused]);

  const loadCards = async () => {
    try {
      const savedCards = await AsyncStorage.getItem("scannedCards");
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      }
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  };

  const handleDelete = async (cardId: string) => {
    try {
      await AsyncStorage.removeItem("scannedCards");
      const updatedCards = cards.filter((card) => card.id !== cardId);
      setCards(updatedCards);
      await AsyncStorage.setItem("scannedCards", JSON.stringify(updatedCards));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const renderCard = ({ item }: { item: CardData }) => (
    <View style={styles.cardItem}>
      <View style={styles.flexRow}>
        {/* Name */}
        <Text style={styles.cardName}>{item.name || "Unknown"}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <MaterialIcons name="highlight-remove" size={20} color="black" />
        </TouchableOpacity>
      </View>
      {item.address && (
        <Text style={styles.cardAddress}>{item.address || "Unknown"}</Text>
      )}

      {/* Email */}
      {item.email ? (
        <View style={styles.detailRow}>
          <MaterialIcons name="email" size={18} color="#555" />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
      ) : null}

      {/* Phone */}
      {item.phone ? (
        <View style={styles.detailRow}>
          <MaterialIcons name="phone" size={18} color="#555" />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
      ) : null}

      {/* Company */}
      {item.companyName ? (
        <View style={styles.detailRow}>
          <MaterialIcons name="business" size={18} color="#555" />
          <Text style={styles.detailText}>{item.companyName}</Text>
        </View>
      ) : null}
    </View>
  );
  const handleClear = async () => {
    try {
      await AsyncStorage.removeItem("scannedCards");
      setCards([]); // Clear the cards state
    } catch (error) {
      console.error("Error clearing cards:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>Business Card Scanner</Text>
        <Link asChild href="/(tabs)/cards/qr-scanner">
          <MaterialIcons name="qr-code-scanner" size={24} color="black" />
        </Link>
      </View>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.push("/(tabs)/cards/camera")}
      >
        <Text style={styles.scanButtonText}>Scan New Card</Text>
      </TouchableOpacity>

      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No cards scanned yet</Text>
        }
        ListFooterComponent={
          cards.length > 0 ? (
            <TouchableOpacity style={styles.scanButton} onPress={handleClear}>
              <Text style={styles.scanButtonText}>Clear All Entries</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  scanButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  scanButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 50,
  },
  cardItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginHorizontal: 20,
  },
  cardName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#555",
  },
  cardAddress: {
    fontSize: 13,
    marginBottom: 8,
    color: "#777",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});
