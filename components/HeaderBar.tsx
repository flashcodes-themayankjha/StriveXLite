
// components/HeaderBar.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const HeaderBar = () => {
  const navigation = useNavigation();
  const [profileVisible, setProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Animations
  const avatarScale = useRef(new Animated.Value(1)).current;
  const settingsRotate = useRef(new Animated.Value(0)).current;

  const handleAvatarPress = () => {
    Animated.timing(avatarScale, {
      toValue: 0.8,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setProfileVisible(true);
    });
  };

  const closeProfileModal = () => {
    Animated.timing(avatarScale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setProfileVisible(false);
    });
  };

  const toggleSettings = () => {
    Animated.timing(settingsRotate, {
      toValue: settingsVisible ? 0 : 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => setSettingsVisible(!settingsVisible));
  };

  const rotateAnim = settingsRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <View style={styles.header}>
        {/* Avatar Left */}
        <Pressable onPress={handleAvatarPress}>
          <Animated.Image
            source={require('../assets/images/bg2.jpg')}
            style={[styles.avatar, { transform: [{ scale: avatarScale }] }]}
          />
        </Pressable>

        {/* Title Center */}
        <View style={styles.titleBox}>
          <Text style={styles.title}>Strive<Text style={styles.highlight}>X</Text></Text>
          <Text style={styles.slogan}>Level Up Your Fitness</Text>
        </View>

        {/* Settings Right */}
        <Pressable onPress={toggleSettings}>
          <Animated.View style={{ transform: [{ rotate: rotateAnim }] }}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </Animated.View>
        </Pressable>
      </View>

      {/* Hunter Profile Modal */}
      <Modal visible={profileVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.level}>Level ∞</Text>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('../assets/images/bg2.jpg')}
                style={styles.profileAvatar}
              />
              <Text style={styles.crown}>👑</Text>
            </View>

            <Text style={styles.name}>Player Mayank Jha</Text>
            <Text style={styles.info}>Date of Joining: 7 June 2025</Text>
            <Text style={styles.info}>DOB : 7 June 2005</Text>
            <Text style={styles.info}>Height : 00</Text>
            <Text style={styles.info}>Weight : 00</Text>

            <View style={styles.divider} />
            <Text style={styles.titleText}>Title : The Progenitor</Text>
            <Text style={styles.titleText}>Admin</Text>
            <View style={styles.divider} />
            <Text style={styles.rank}>Rank: <Text style={{ color: '#fff' }}>SSS (God)</Text></Text>

            <Pressable onPress={closeProfileModal} style={styles.closeBtn}>
              <Ionicons name="close-circle" size={28} color="#aaa" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 25,
    backgroundColor: '#121212',
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  titleBox: { alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  highlight: { color: '#FF3B30' },
  slogan: { fontSize: 10, color: '#ccc', marginTop: -2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: width * 0.85,
  },
  level: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  crown: {
    position: 'absolute',
    top: -18,
    left: 28,
    fontSize: 32,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
  },
  info: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#6a0dad',
    width: '100%',
    marginVertical: 12,
  },
  titleText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
  rank: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

export default HeaderBar;
