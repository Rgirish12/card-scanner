import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CardData } from "src/types";

interface CardItemProps {
  card: CardData;
  onPress: () => void;
  onDelete?: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.name}>{card.name || "Unknown Name"}</Text>
        {card.company && <Text style={styles.company}>{card.company}</Text>}
        {card.jobTitle && <Text style={styles.jobTitle}>{card.jobTitle}</Text>}
        {card.email && <Text style={styles.email}>{card.email}</Text>}
        {card.phone && <Text style={styles.phone}>{card.phone}</Text>}
        <Text style={styles.timestamp}>
          {new Date(card.timestamp).toLocaleDateString()}
        </Text>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: "#007AFF",
    marginBottom: 2,
  },
  phone: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
