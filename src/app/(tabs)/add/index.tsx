import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";
import { TransactionForm } from "./transaction-form";

const Tab = createMaterialTopTabNavigator();

export default function AddScreen() {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "white" : "black",
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold", marginTop: 28 },
        tabBarIndicatorStyle: {
          backgroundColor: colorScheme === "dark" ? "white" : "black",
        },
        tabBarStyle: { backgroundColor: colors.primaryContainer },
      }}
    >
      <Tab.Screen name="Despesa">
        {() => <TransactionForm type="expense" />}
      </Tab.Screen>
      <Tab.Screen name="Receita">
        {() => <TransactionForm type="income" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
