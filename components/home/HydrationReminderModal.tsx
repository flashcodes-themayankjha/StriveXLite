
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';



interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function HydrationReminderModal({ visible, onClose }: Props) {
  const [interval, setInterval] = useState<number>(30);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  const handleSetReminder = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Hydration Reminder',
        body: `Time to drink water! (${interval} min interval)`
      },
      trigger: {
        seconds: interval * 60,
        repeats: true
      }
    });

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.title}>Set Hydration Reminder</Text>

              <Picker
                selectedValue={interval}
                style={styles.picker}
                onValueChange={(itemValue: number) => setInterval(itemValue)}
              >
                <Picker.Item label="15 minutes" value={15} />
                <Picker.Item label="30 minutes" value={30} />
                <Picker.Item label="60 minutes" value={60} />
              </Picker>

              <Pressable style={styles.button} onPress={handleSetReminder}>
                <Text style={styles.buttonText}>Set Reminder</Text>
              </Pressable>

              <Pressable onPress={onClose}>
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1c1c1e',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    color: '#fff',
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancel: {
    color: '#aaa',
    marginTop: 8,
  },
});
