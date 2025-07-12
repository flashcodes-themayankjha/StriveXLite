// components/ui/TabBarBackground.tsx
import { View } from 'react-native';

export default function TabBarBackground() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#121212', // 👈 Dark background
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
    />
  );
}

