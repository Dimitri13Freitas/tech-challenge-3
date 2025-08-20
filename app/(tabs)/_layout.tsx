import AntDesign from "@expo/vector-icons/AntDesign";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { BottomNavigation, useTheme } from "react-native-paper";
import HomeScreen from ".";
import AddScreen from "./add";
import ReportsScreen from "./reports";
import TransactionScreen from "./transactions";
import UserScreen from "./user";

const Tab = createBottomTabNavigator();

export default function App() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        animation: "none",
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          style={{
            height: 70,
          }}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) =>
            descriptors[route.key].options.tabBarIcon?.({
              focused,
              color,
              size: 24,
            }) || null
          }
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === "string"
                ? options.tabBarLabel
                : typeof options.title === "string"
                ? options.title
                : route.name;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Início"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Transações"
        component={TransactionScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="swap" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name=" "
        component={AddScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Relatórios"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="barschart" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Usuário"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
