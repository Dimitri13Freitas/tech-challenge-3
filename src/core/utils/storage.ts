import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  set: async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  get: async (key: string) => {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};
