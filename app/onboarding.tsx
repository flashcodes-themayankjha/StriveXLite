
import { View, Text, StyleSheet, Pressable, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
      <View style={styles.imageWrapper}>
  <ImageBackground
    source={require('../assets/images/bg2.jpg')}
    style={styles.background}
    resizeMode="cover"
    imageStyle={styles.curvedImage} // 👈 this line is key
  >
    {/* glass overlay */}
    <View style={styles.overlay}>
      <BlurView intensity={80} tint="dark" style={styles.glass}>
        <Text style={styles.title}>
          Strive<Text style={styles.highlight}>X</Text>
        </Text>

        <Text style={styles.subtitle}>Level Up Your Fitness</Text>

        <Text style={styles.description}>
          Embark on a fitness journey inspired by the world of Solo Leveling.
          Track your progress, complete challenges, and ascend to new heights.
        </Text>

        <Pressable style={styles.button} onPress={() => router.replace('/signin')}>
          <Text style={styles.buttonText}>Enter The Dungeon</Text>
        </Pressable>
      </BlurView>
    </View>
  </ImageBackground>
</View>
 

  );
}
const styles = StyleSheet.create({
  
imageWrapper: {
  flex: 1,
  overflow: 'hidden', // important to clip the curve
  borderBottomLeftRadius: 50,
  borderBottomRightRadius: 50,
},

background: {
  flex: 1,
  justifyContent: 'flex-end', // aligns glass at bottom
},

curvedImage: {
  borderBottomLeftRadius: 50,
  borderBottomRightRadius: 50,
},


    overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },

glass: {
  backgroundColor: 'rgba(18,18,18,0.7)',
  borderRadius: 40,
  padding: 24,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.05)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.2,
  shadowRadius: 12,
  elevation: 10, // Android shadow
},

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  highlight: {
    color: '#FF3B30', // Red "X"
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFFAA',
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

