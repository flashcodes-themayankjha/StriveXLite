// app/tabs/index.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#0a0a0a' },
      tabBarActiveTintColor: '#00ffff',
    }}>
      <Tabs.Screen name="home" options={{ title: 'Daily Quest' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
      <Tabs.Screen name="rewards" options={{ title: 'Rewards' }} />
    </Tabs>
  );
}
