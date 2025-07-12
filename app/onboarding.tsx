
import { View, Text, StyleSheet, Pressable, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.imageWrapper}>
      <ImageBackground
        source={require('../assets/images/bg2.jpg')}
        style={styles.background}
        resizeMode="cover"
        imageStyle={styles.curvedImage}
      >
        <Animatable.View
          animation="fadeInUp"
          delay={300}
          duration={1000}
          style={styles.overlay}
        >
          <BlurView intensity={80} tint="dark" style={styles.glass}>
            <Animatable.Text
              animation="zoomIn"
              delay={500}
              duration={1000}
              style={styles.title}
            >
              Strive<Text style={styles.highlight}>X</Text>
            </Animatable.Text>

            <Animatable.Text animation="fadeIn" delay={700} style={styles.subtitle}>
              Level Up Your Fitness
            </Animatable.Text>

            <Animatable.Text animation="fadeIn" delay={900} style={styles.description}>
              Embark on a fitness journey inspired by the world of Solo Leveling.
              Track your progress, complete challenges, and ascend to new heights.
            </Animatable.Text>

            <Animatable.View animation="bounceIn" delay={1200}>
              <Pressable style={styles.button} onPress={() => router.replace('/signin')}>
                <Text style={styles.buttonText}>Enter The Dungeon</Text>
              </Pressable>
            </Animatable.View>
          </BlurView>
        </Animatable.View>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  imageWrapper: {
    flex: 1,
    overflow: 'hidden',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
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
  },
  glass: {
    backgroundColor: 'rgba(18,18,18,0.7)',
    borderRadius: 40,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24, // slight bottom padding restored for breathing room
    minHeight: 350, // 👈 increase height
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  highlight: {
    color: '#FF3B30',
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
    marginTop: 60,
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

