import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LanguageSelectionScreen from './LanguageSelectionScreen';
import ChatScreen from './ChatScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (

  <Stack.Navigator initialRouteName="LanguageSelection">
    <Stack.Screen
      name="LanguageSelection"
      component={LanguageSelectionScreen}
      options={{ title: 'Language Selection' }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => ({ title: route.params.language.charAt(0).toUpperCase() + route.params.language.slice(1) })}
    />
  </Stack.Navigator>
);

export default AppNavigator;


