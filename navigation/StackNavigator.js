// navigation/StackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator({ userExists }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userExists ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
}

