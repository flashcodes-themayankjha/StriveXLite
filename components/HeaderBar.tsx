
// components/HeaderBar.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderBar = () => {
  const navigation = useNavigation();

  const [profileVisible, setProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const avatarScale = useRef(new Animated.Value(1)).current;
  const settingsRotate = useRef(new Animated.Value(0)).current;

  // Load hunter profile from AsyncStorage
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('hunterProfile');
      if (raw) {
        setUserData(JSON.parse(raw));
      }
    })();
  }, [profileVisible]);

  const rotateSettingsIcon = (open: boolean) => {
    Animated.timing(settingsRotate, {
      toValue: open ? 1 : 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    setSettingsVisible(open);
  };

  const zoomAvatar = (show: boolean) => {
    Animated.timing(avatarScale, {
      toValue: show ? 1.3 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setProfileVisible(show);
  };

  const rotate = settingsRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/onboarding');
  };

  return (
    <>
      <View style={styles.header}>
        {/* Avatar */}
        <Pressable onPress={() => zoomAvatar(true)}>
          <Animated.Image
            source={require('../assets/images/bg2.jpg')}
            style={[styles.avatar, { transform: [{ scale: avatarScale }] }]}
          />
        </Pressable>

        {/* Title + Subtitle */}
        <View style={styles.centerText}>
          <Text style={styles.title}>Strive<Text style={styles.highlight}>X</Text></Text>
          <Text style={styles.subtitle}>Level Up Your Fitness</Text>
        </View>

        {/* Settings Icon */}
        <Pressable onPress={() => rotateSettingsIcon(!settingsVisible)}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="settings-outline" size={26} color="#fff" />
          </Animated.View>
        </Pressable>
      </View>

      {/* 🧍 Hunter Profile Modal */}
      <Modal visible={profileVisible} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.level}>Level {userData?.level ?? '∞'}</Text>

      <View style={styles.avatarWrapper}>
        <Image
          source={require('../assets/images/bg2.jpg')}
          style={styles.profileAvatar}
        />
        <Text style={styles.crown}>👑</Text>
      </View>

      <Text style={styles.name}>Player {userData?.name ?? 'Unknown'}</Text>
      <Text style={styles.info}>Date of Joining: {userData?.joined ?? 'N/A'}</Text>
      <Text style={styles.info}>Age: {userData?.age ?? 'N/A'}</Text>
      <Text style={styles.info}>Height: {userData?.height ?? '00'}</Text>
      <Text style={styles.info}>Weight: {userData?.weight ?? '00'}</Text>

      <View style={styles.divider} />
      <Text style={styles.titleText}>Title: {userData?.title ?? 'The Progenitor'}</Text>
      <Text style={styles.titleText}>💎 Gems: {userData?.gems ?? 0}</Text>
      <View style={styles.divider} />

      <Text style={styles.rank}>
        Rank: <Text style={{ color: '#fff' }}>{userData?.rank ?? 'SSS (God)'}</Text>
      </Text>

      <Pressable onPress={() => zoomAvatar(false)} style={styles.closeIcon}>
        <Ionicons name="close-circle" size={28} color="#aaa" />
      </Pressable>
    </View>
  </View>
</Modal>

      {/* ⚙️ Settings Modal */}
      <Modal animationType="slide" transparent={true} visible={settingsVisible} onRequestClose={() => rotateSettingsIcon(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.settingsContainer}>
            <Text style={styles.modalTitle}>Settings</Text>

            <Pressable
              style={styles.modalBtn}
              onPress={() => {
                rotateSettingsIcon(false);
                router.push('/setquest');
              }}
            >
              <Ionicons name="calendar-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.modalBtnText}>Edit Daily Quest</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={() => setIsDarkMode(!isDarkMode)}>
              <Ionicons name="contrast-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.modalBtnText}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={() => {
              rotateSettingsIcon(false);
              router.push('/ExerciseCardPreview');
            }}>
              <Ionicons name="code-slash-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.modalBtnText}>Component Preview</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.modalBtnText}>Logout</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={() => rotateSettingsIcon(false)}>
              <Ionicons name="close-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.modalBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#121212',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 10,
    marginBottom:8,
    paddingBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  centerText: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

level: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#ccc',
  marginBottom: 10,
},

avatarWrapper: {
  position: 'relative',
  marginBottom: 10,
},

profileAvatar: {
  width: 100,
  height: 100,
  borderRadius: 50,
  borderWidth: 2,
  borderColor: '#fff',
},

crown: {
  position: 'absolute',
  top: -8,
  right: -10,
  fontSize: 24,
},

name: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 4,
},

info: {
  fontSize: 14,
  color: '#ccc',
  marginVertical: 2,
},

divider: {
  width: '100%',
  height: 1,
  backgroundColor: '#444',
  marginVertical: 10,
},

titleText: {
  color: '#fffaa0',
  fontSize: 14,
  fontWeight: '600',
},

rank: {
  color: '#aaa',
  marginTop: 4,
  fontSize: 14,
},

  highlight: {
    color: '#FF3B30',
  },
  subtitle: {
    fontSize: 10,
    color: '#aaa',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
  },
  settingsContainer: {
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
  profileText: {
    color: '#ccc',
    fontSize: 15,
    marginVertical: 3,
  },
    closeIcon: {
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 1,
},
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HeaderBar;
