import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem('user');
      const hunter = await AsyncStorage.getItem('hunterProfile');

      if (user) {
        if (hunter) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/hunter-details');
        }
      } else {
        router.replace('/onboarding');
      }

      setChecking(false);
    };

    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Please enable notifications for hydration reminders!');
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
          sound: true,
        });
      }
    };

    checkAuth();
    requestNotificationPermission();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#121212' }}>
      {checking && <ActivityIndicator color="#1E90FF" size="large" />}
    </View>  
  );
}
