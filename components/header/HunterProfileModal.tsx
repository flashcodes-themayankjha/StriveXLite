import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const HunterProfileModal = ({ visible, onClose }: Props) => {
  const [userData, setUserData] = useState<any>(null);

useEffect(() => {
  if (visible) {
    (async () => {
      const raw = await AsyncStorage.getItem('hunterProfile');
      if (raw) {
        const profile = JSON.parse(raw);

        // Normalize keys
        const normalized = {
          ...profile,
          experience: profile.xp ?? profile.experience ?? 0,
          levelXp: profile.nextLevelXp ?? profile.levelXp ?? 1000,
        };

        setUserData(normalized);
      }
    })();
  }
}, [visible]);

   const getXpProgress = () => {
    const current = userData?.experience ?? 0;
    const required = userData?.levelXp ?? 1000;
    return Math.min((current / required) * 100, 100);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.name}>Player {userData?.name ?? 'Unknown'}</Text>

          <View style={styles.avatarWrapper}>
            <Image source={require('../../assets/images/bg2.jpg')} style={styles.profileAvatar} />
            <Text style={styles.crown}>👑</Text>
          </View>

          <Text style={styles.level}>Level {userData?.level ?? '∞'}</Text>

          <View style={styles.xpBarContainer}>
            <View style={[styles.xpBarFill, { width: `${getXpProgress()}%` }]} />
          </View>
          <Text style={styles.xpLabel}>
            {userData?.experience ?? 0} / {userData?.levelXp ?? 1000} XP
          </Text>

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

          <Pressable onPress={onClose} style={styles.closeIcon}>
            <Ionicons name="close-circle" size={28} color="#aaa" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
  level: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccc',
    marginBottom: 6,
  },
  xpBarContainer: {
    height: 8,
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  xpBarFill: {
    height: 8,
    backgroundColor: '#1E90FF',
  },
  xpLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 10,
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
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default HunterProfileModal;
