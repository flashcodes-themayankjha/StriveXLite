import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MotiView } from 'moti';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#ffffff', // subtle white glow
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Quest',
          tabBarIcon: ({ color, focused }) => (
            <MotiView
              from={{ scale: 1 }}
              animate={{ scale: focused ? 1.2 : 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
            >
              <IconSymbol
                size={24}
                name="dumbbell"
                color={color}
                pack="MaterialCommunity"
              />
            </MotiView>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, focused }) => (
            <MotiView
              from={{ scale: 1 }}
              animate={{ scale: focused ? 1.2 : 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
            >
              <IconSymbol
                size={24}
                name="crown"
                color={color}
                pack="FontAwesome5"
              />
            </MotiView>
          ),
        }}
      />
      <Tabs.Screen
        name="guild"
        options={{
          title: 'Guild',
          tabBarIcon: ({ color, focused }) => (
            <MotiView
              from={{ scale: 1 }}
              animate={{ scale: focused ? 1.2 : 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
            >
              <IconSymbol
                size={24}
                name="sword-cross"
                color={color}
                pack="MaterialCommunity"
              />
            </MotiView>
          ),
        }}
      />
    </Tabs>
  );
}

