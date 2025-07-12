
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Image,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';

export default function HunterDetails() {
  const router = useRouter();
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      dob: new Date(),
      gender: 'male',
      height: '170',
      weight: '70',
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [playerName, setPlayerName] = useState('Player');
  const [focusedField, setFocusedField] = useState('');
  const animRef = useRef(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('user');
      const user = raw ? JSON.parse(raw) : {};
      setPlayerName(user?.name || 'Player');
    })();
  }, []);

  const dob = useWatch({ control, name: 'dob' });
  const height = useWatch({ control, name: 'height' });
  const weight = useWatch({ control, name: 'weight' });
  const gender = useWatch({ control, name: 'gender' });

  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365));
  const bmi = Number((weight / ((Number(height) / 100) ** 2)).toFixed(1));
  const bmiCategory =
    bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy' : bmi < 30 ? 'Overweight' : 'Obese';

  const onSubmit = async () => {
    try {
      const raw = await AsyncStorage.getItem('user');
      const user = raw ? JSON.parse(raw) : {};
      const profile = {
        name: user.name || '',
        age,
        dob,
        gender,
        height,
        weight,
        bmi,
        bmiCategory,
        level: 0,
        exp: 0,
        rank: 'F',
        title: 'Gem None',
      };
      await AsyncStorage.setItem('hunterProfile', JSON.stringify(profile));
      router.replace('/home');
    } catch {
      Alert.alert('Error', 'Could not save hunter details');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Animatable.View animation="fadeInUp" style={styles.container}>
        {/* Player Illustration with Zoom on Tap */}
        <Pressable
          onPress={() => {
            animRef.current?.transitionTo({ transform: [{ scale: 1.3 }] }, 300);
            setTimeout(() => {
              animRef.current?.transitionTo({ transform: [{ scale: 1 }] }, 300);
            }, 300);
          }}
        >
          <Animatable.View ref={animRef} style={{ alignSelf: 'center' }}>
            <Image source={require('../assets/images/bg2.jpg')} style={styles.illustration} />
          </Animatable.View>
        </Pressable>

        <Text style={styles.greeting}>Welcome {playerName}!</Text>
        <Text style={styles.prompt}>Please enter your details to begin your journey</Text>

        {/* DOB */}
        <Text style={styles.label}>Date of Birth:</Text>
        <Pressable
          style={[
            styles.dtpPressable,
            focusedField === 'dob' && styles.inputFocused,
          ]}
          onPressIn={() => setFocusedField('dob')}
          onPressOut={() => setFocusedField('')}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dtpText}>{new Date(dob).toDateString()}</Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(dob)}
            mode="date"
            maximumDate={new Date()}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) setValue('dob', date);
            }}
          />
        )}

        {/* Gender Selection with Animation */}
        <Text style={styles.label}>Gender:</Text>
        <View style={styles.row}>
          {['male', 'female', 'other'].map((g) => {
            const isSelected = gender === g;
            const baseIconColor =
              g === 'male' ? '#1E90FF' : g === 'female' ? '#FF69B4' : '#FFA500';
            const iconColor = isSelected ? '#fff' : baseIconColor;

            return (
              <Animatable.View
                key={g}
                animation={isSelected ? 'pulse' : undefined}
                duration={300}
                iterationCount={1}
                style={{ flex: 1, marginHorizontal: 4 }}
              >
                <Pressable
                  style={[styles.genderBtn, isSelected && styles.genderSelected]}
                  onPress={() => setValue('gender', g)}
                >
                  {g === 'male' && <Ionicons name="male" size={28} color={iconColor} />}
                  {g === 'female' && <Ionicons name="female" size={28} color={iconColor} />}
                  {g === 'other' && <FontAwesome5 name="genderless" size={28} color={iconColor} />}
                </Pressable>
              </Animatable.View>
            );
          })}
        </View>

        {/* Height & Weight */}
        <Text style={styles.label}>Height & Weight:</Text>
        <View style={styles.row}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Height (cm)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={height}
              onFocus={() => setFocusedField('height')}
              onBlur={() => setFocusedField('')}
              onChangeText={(val) => setValue('height', val)}
              style={[styles.input, focusedField === 'height' && styles.inputFocused]}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Weight (kg)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={weight}
              onFocus={() => setFocusedField('weight')}
              onBlur={() => setFocusedField('')}
              onChangeText={(val) => setValue('weight', val)}
              style={[styles.input, focusedField === 'weight' && styles.inputFocused]}
            />
          </View>
        </View>

        {/* Stats */}
        <Animatable.View animation="fadeIn" delay={300} style={styles.stats}>
          <Text style={styles.statText}>
            Age: {age} | BMI: {bmi} ({bmiCategory})
          </Text>
        </Animatable.View>

        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Begin Journey</Text>
        </Pressable>
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 60,
    paddingTop: 30,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: '#121212',
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  prompt: {
    fontSize: 16,
    color: '#fffaa0',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 8,
    marginTop: 16,
  },
  dtpPressable: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#333',
    borderWidth: 1,
  },
  dtpText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  genderSelected: {
    backgroundColor: '#1E90FF',
  },
  inputWrapper: {
    width: '48%',
  },
  input: {
    backgroundColor: '#222',
    borderRadius: 12,
    borderColor: '#333',
    borderWidth: 1,
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  inputFocused: {
    borderColor: '#1E90FF',
    borderWidth: 2,
  },
  stats: {
    marginBottom: 24,
    marginTop: 12,
  },
  statText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
