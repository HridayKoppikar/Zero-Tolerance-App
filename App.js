import "./gesture-handler";
import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importing screen components
import Home from "./components/home";
import Login from "./components/login";
import Form from "./components/form";
import Contact from "./components/contact";
import About from "./components/about";

export default function App() {
  // Creating the stack navigator
  const Stack = createNativeStackNavigator();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Report"
            component={Form}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Contact"
            component={Contact}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="About"
            component={About}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
