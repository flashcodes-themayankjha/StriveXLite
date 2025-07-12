
import { View, Text, TextInput, StyleSheet, Pressable, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Too short').required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Required'),
});

export default function SignupScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

        const onSubmit = async (data: any) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify({ ...data, isSignedIn: true }));
    router.replace('/hunter-details'); // go to Hunter Details screen
  } catch (e) {
    console.error('Failed to save user', e);
  }
};



  return (
    <View style={styles.container}>
     <Image source={require('../assets/images/bg2.jpg')} style={styles.image} />

      <Text style={styles.heading}>Create your account</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Name"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={value}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Text style={styles.or}>Or continue with</Text>

      <View style={styles.socials}>
        <FontAwesome name="google" size={28} color="#DB4437" />
        <FontAwesome name="facebook" size={28} color="#1877F2" />
        <FontAwesome name="apple" size={28} color="#fff" />
      </View>

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Text style={styles.bottomText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => router.push('/signin')}>
          Log In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  banner: { width: '100%', height: 180, resizeMode: 'cover', borderRadius: 12, marginBottom: 20 },
  image: {
  width: '100%',
  height: 200,
  resizeMode: 'cover',
  borderRadius: 12,
  marginBottom: 20,
},
  heading: { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 6,
  },
  error: { color: '#f66', marginLeft: 4, marginBottom: 4 },
  or: { textAlign: 'center', color: '#aaa', marginVertical: 12 },
  socials: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  bottomText: { textAlign: 'center', color: '#ccc', marginTop: 12 },
  link: { color: '#1E90FF', fontWeight: 'bold' },
});
