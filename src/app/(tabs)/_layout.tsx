import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarStyle: {
          height: 70,
          borderTopWidth: 1,
          borderTopColor: colors.surfaceVariant,
          backgroundColor: colors.elevation.level4,
        },
        tabBarItemStyle: {
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions/index"
        options={{
          title: "Transações",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="swap" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="add/index"
        options={{
          title: " ",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="plus" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports/index"
        options={{
          title: "Relatórios",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="bar-chart" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="user/index"
        options={{
          title: "Usuário",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" color={color} size={26} />
          ),
        }}
      />
    </Tabs>
  );
}
