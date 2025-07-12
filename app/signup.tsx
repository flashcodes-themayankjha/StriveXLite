import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const schema = yup.object().shape({
  name: yup.string().min(2, 'Too short').required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Required'),
});

export default function SignupScreen() {
  const router = useRouter();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify({ ...data, isSignedIn: true }));
      router.replace('/hunter-details');
    } catch (e) {
      console.error('Failed to save user', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated image banner */}
      <Animated.Image
        entering={FadeInUp.duration(800)}
        source={require('../assets/images/bg2.jpg')}
        style={styles.image}
      />

      <Animated.View style={styles.formContainer} entering={FadeInDown.duration(800).delay(200)}>
        <Text style={styles.heading}>Create your account</Text>

        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Name"
              placeholderTextColor="#aaa"
              style={[
                styles.input,
                focusedField === 'name' && styles.inputFocused,
              ]}
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
          )}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              style={[
                styles.input,
                focusedField === 'email' && styles.inputFocused,
              ]}
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              style={[
                styles.input,
                focusedField === 'password' && styles.inputFocused,
              ]}
              value={value}
              onChangeText={onChange}
              secureTextEntry
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        <Text style={styles.or}>Or continue with</Text>

        <View style={styles.socials}>
          <Image source={require('../assets/images/google.png')} style={styles.socialIcon} />
          <Image source={require('../assets/images/facebook.png')} style={styles.socialIcon} />
          <FontAwesome name="apple" size={28} color="#fff" />
        </View>

        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>

        <Text style={styles.bottomText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => router.push('/signin')}>Log In</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },

  image: {
    width: '100%',
    height: height * 0.5,
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },

  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#333',
  },

  inputFocused: {
    borderColor: '#1E90FF',
    borderWidth: 2,
  },

  error: { color: '#f66', marginLeft: 4, marginBottom: 4 },

  or: { textAlign: 'center', color: '#aaa', marginVertical: 12 },

  socials: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },

  socialIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },

  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  bottomText: {
    textAlign: 'center',
    color: '#ccc',
    marginTop: 12,
  },

  link: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});

