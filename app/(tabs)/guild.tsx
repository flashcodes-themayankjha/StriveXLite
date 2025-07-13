import { View, Text, StyleSheet } from 'react-native';

export default function GuildScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🛡️ Your Guild Page</Text>
              <Text style={styles.text}> Comming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  text: { color: '#fff', fontSize: 20 }
});

