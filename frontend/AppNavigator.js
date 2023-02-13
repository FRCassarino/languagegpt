import React, { useState, useRef, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LanguageSelectionScreen from "./LanguageSelectionScreen";
import ChatScreen from "./ChatScreen";
import { TouchableOpacity, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
const Stack = createStackNavigator();

const AppNavigator = () => {
  const [initialLanguage, setInitialLanguage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const language = await AsyncStorage.getItem("language");
      console.log(language);
      if (language) {
        setInitialLanguage(language);
      }
      setLoading(false);
    })();
  }, []);

  return loading == false ? (
    <Stack.Navigator
      initialRouteName={initialLanguage ? "Chat" : "LanguageSelection"}
    >
      <Stack.Screen
        name="LanguageSelection"
        component={LanguageSelectionScreen}
        options={{ title: "Language Selection" }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        initialParams={{ language: initialLanguage }}
        options={({ navigation, route }) => ({
          title:
            route.params.language.charAt(0).toUpperCase() +
            route.params.language.slice(1),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("LanguageSelection")}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="settings" size={22} color="gray" />
            </TouchableOpacity>
          ),
          headerLeft: () => <View />,
        })}
      />
    </Stack.Navigator>
  ) : (
    <Text>Loading...</Text>
  );
};

export default AppNavigator;
