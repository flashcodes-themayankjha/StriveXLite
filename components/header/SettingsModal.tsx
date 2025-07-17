import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Vibration,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal = ({ visible, onClose }: Props) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scaleAnim] = useState(new Animated.Value(1));

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    Vibration.vibrate(10);
  };

  const handleLogout = async () => {
    animatePress();
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace('/onboarding');
        },
      },
    ]);
  };

  const handlePress = (callback: () => void) => {
    animatePress();
    callback();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.modalTitle}>⚙️ Settings</Text>

          <Pressable
            style={styles.modalBtn}
            onPress={() => handlePress(() => {
              onClose();
              router.push('/setquest');
            })}
          >
            <Ionicons name="calendar-outline" size={18} color="#fff" style={styles.icon} />
            <Text style={styles.modalBtnText}>Edit Daily Quest</Text>
          </Pressable>

          <Pressable
            style={styles.modalBtn}
            onPress={() => handlePress(() => setIsDarkMode(!isDarkMode))}
          >
            <Ionicons name="contrast-outline" size={18} color="#fff" style={styles.icon} />
            <Text style={styles.modalBtnText}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</Text>
          </Pressable>

          <Pressable
            style={styles.modalBtn}
            onPress={() => handlePress(() => {
              onClose();
              router.push('/DBPreview');
            })}
          >
            <Ionicons name="code-slash-outline" size={18} color="#fff" style={styles.icon} />
            <Text style={styles.modalBtnText}>Component Preview</Text>
          </Pressable>

             <Pressable
            style={styles.modalBtn}
            onPress={() => handlePress(() => {
              onClose();
              router.push('/exerciselib');
            })}
          >
            <Ionicons name="code-slash-outline" size={18} color="#fff" style={styles.icon} />
            <Text style={styles.modalBtnText}>All Quests</Text>
          </Pressable>

          <Pressable style={styles.modalBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#fff" style={styles.icon} />
            <Text style={styles.modalBtnText}>Logout</Text>
          </Pressable>

          <Pressable style={styles.modalBtn} onPress={() => handlePress(onClose)}>
            <Ionicons name="close-outline" size={18} color="#fff" style={styles.icon} />
            <Text style={styles.modalBtnText}>Close</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  icon: {
    marginRight: 8,
  },
});

export default SettingsModal;
