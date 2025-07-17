
// ToastManager.ts
import RootSiblings from 'react-native-root-siblings';
import { Text, View, StyleSheet, Dimensions, Platform } from 'react-native';

let toast: RootSiblings | null = null;

export function showToast(message: string, duration = 2000) {
  if (toast) {
    toast.destroy();
  }

  toast = new RootSiblings(
    <View style={styles.toastContainer}>
      <View style={styles.toast}>
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </View>
  );

  setTimeout(() => {
    toast?.destroy();
    toast = null;
  }, duration);
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    backgroundColor: 'rgba(60,60,60,0.95)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    maxWidth: Dimensions.get('window').width - 40,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
