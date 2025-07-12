import { View, Text, TextInput, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';


const { height } = Dimensions.get('window');

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Required'),
});

export default function SigninScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data: any) => {
    console.log('Form:', data);
    // Add logic here
  };

  return (
    <View style={styles.container}>
      {/* Top 50% image */}
      <Image source={require('../assets/images/bg2.jpg')} style={styles.banner} />

      {/* Bottom 50% content */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Player</Text>

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

        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <Text style={styles.or}>Or continue with</Text>

        <View style={styles.socials}>
          <Image
            source={require('../assets/images/google.png')} // Optional: use local icon
            style={styles.socialIcon}
            />
          <Image
            source={require('../assets/images/facebook.png')} // Optional: use local icon
            style={styles.socialIcon}
          />
            <FontAwesome name="apple" size={28} color="#fff" />
        </View>

        <Text style={styles.bottomText}>
          Don't have an account?{' '}
          <Text style={styles.link} onPress={() => router.push('/signup')}>
            Sign Up
          </Text>
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
  banner: {
    height: height * 0.5,
    width: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
  overflow: 'hidden', // IMPORTANT to clip the curve
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 6,
  },
  error: {
    color: '#f66',
    marginLeft: 6,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  or: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 16,
  },
socials: {
  flexDirection: 'row',
  justifyContent: 'space-evenly', // Equal space around icons
  alignItems: 'center',
  marginBottom: 24,
  marginTop: 8,
},

socialIcon: {
  width: 36,
  height: 36,
  resizeMode: 'contain', // Keeps proportions correct
},

  bottomText: {
    textAlign: 'center',
    color: '#ccc',
  },
  link: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});




