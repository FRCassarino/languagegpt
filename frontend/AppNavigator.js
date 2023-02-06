import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LanguageSelectionScreen from './LanguageSelectionScreen';
import ChatScreen from './ChatScreen';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  options={({ navigation, route }) => ({
    title: route.params.language.charAt(0).toUpperCase() + route.params.language.slice(1),
    headerRight: () => (
     <TouchableOpacity onPress={() => navigation.navigate('LanguageSelection')} style={{marginRight: 10}}> 
         <Ionicons name="settings" size={22} color="gray"/>
     </TouchableOpacity>
    ),
    headerLeft: () => (<View />),
  })}
/>
  </Stack.Navigator>
);

export default AppNavigator;



