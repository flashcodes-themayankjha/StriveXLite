import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HeaderBar from '../../components/header/HeaderBar';

export default function Leaderboard() {
  return (
    <View style={styles.container}>
      <HeaderBar showBack showSettings={false} />

      <View style={styles.body}>
        <MaterialCommunityIcons name="sword-cross" size={72} color="#CECECE" style={{ marginBottom: 20 }} />
        <Text style={styles.text}>Your Guild Page</Text>
        <Text style={styles.text}>Coming Soon</Text>
                <Text style={styles.textsn}>Developed by Mayank Jha from Flashcodes</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Developed by Mayank Kumar Jha from Team Flashcodes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 6,
  },
  textsn: {
        color: '#808080',
        fontSize: 16,
        marginTop: 25,
        marginBottom: 6,
    },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  footerText: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
  },
});
