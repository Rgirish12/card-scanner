import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CardData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  rawText: string;
  timestamp: string;
}

export default function HomeScreen() {
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    loadCards();
  }, []);

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

  const renderCard = ({ item }: { item: CardData }) => (
    <View style={styles.cardItem}>
      <Text style={styles.cardName}>{item.name || "Unknown"}</Text>
      <Text>{item.email}</Text>
      <Text>{item.phone}</Text>
      <Text>{item.company}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Card Scanner</Text>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.push("/camera")}
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
      />
    </View>
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
  cardItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  cardName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 50,
  },
});
