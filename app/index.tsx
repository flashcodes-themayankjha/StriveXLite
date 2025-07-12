
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem('user');
      const hunter = await AsyncStorage.getItem('hunterProfile');

      if (user) {
        if (hunter) {
          router.replace('/(tabs)/home'); // ✅ Corrected
        } else {
          router.replace('/hunter-details');
        }
      } else {
        router.replace('/onboarding');
      }

      setChecking(false);
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#121212' }}>
      {checking && <ActivityIndicator color="#1E90FF" size="large" />}
    </View>  
  );
}
