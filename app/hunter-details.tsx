import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function HunterDetails() {
  const router = useRouter();
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await AsyncStorage.setItem('hunterProfile', JSON.stringify(data));
      router.replace('/home'); // or whatever screen comes after
    } catch (e) {
      Alert.alert('Error', 'Could not save hunter details');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Your Hunter Details</Text>

      <Controller
        control={control}
        name="age"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Age"
            keyboardType="numeric"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="weight"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Weight (kg)"
            keyboardType="numeric"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="height"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Height (cm)"
            keyboardType="numeric"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 24 },
  heading: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

