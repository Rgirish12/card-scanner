import AsyncStorage from "@react-native-async-storage/async-storage";
import { CardData } from "@/types";

const STORAGE_KEY = "scannedCards";

export const saveCard = async (card: CardData): Promise<void> => {
  try {
    const existingCards = await getCards();
    const updatedCards = [...existingCards, card];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
  } catch (error) {
    throw new Error("Failed to save card");
  }
};

export const getCards = async (): Promise<CardData[]> => {
  try {
    const cardsJson = await AsyncStorage.getItem(STORAGE_KEY);
    return cardsJson ? JSON.parse(cardsJson) : [];
  } catch (error) {
    return [];
  }
};

export const deleteCard = async (cardId: string): Promise<void> => {
  try {
    const existingCards = await getCards();
    const filteredCards = existingCards.filter((card) => card.id !== cardId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCards));
  } catch (error) {
    throw new Error("Failed to delete card");
  }
};

export const updateCard = async (updatedCard: CardData): Promise<void> => {
  try {
    const existingCards = await getCards();
    const updatedCards = existingCards.map((card) =>
      card.id === updatedCard.id ? updatedCard : card
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
  } catch (error) {
    throw new Error("Failed to update card");
  }
};
