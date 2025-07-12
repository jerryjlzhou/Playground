import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'

const Home = () => {
  const router = useRouter()

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      router.push({ 
        pathname: '/editPage', 
        params: { imageUri: result.assets[0].uri } 
      });
    }
  }

  const handleUploadImage = async () => {
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    })
    
    if (!result.canceled && result.assets?.[0]?.uri) {
      router.push({ 
        pathname: '/editPage', 
        params: { imageUri: result.assets[0].uri } 
      })
    }
  }

  return (
    <ScreenWrapper bg={theme.colors.midnight}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>ShapeQuest</Text>
          <Text style={styles.subtitle}>Solve geometry problems with AI</Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Get Started</Text>
            <Text style={styles.welcomeText}>
              Take a photo or upload an image of your question to begin interacting
            </Text>
          </View>

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            <Button 
              title="Take a photo"
              onPress={handleTakePhoto}
              buttonStyle={[styles.primaryButton, styles.buttonSpacing]}
              textStyle={[styles.primaryButtonText, {fontWeight: 'bold'}]}
            />
            <Button 
              title="Upload an image"
              onPress={handleUploadImage}
              buttonStyle={[styles.secondaryButton, styles.buttonSpacing]}
              textStyle={[styles.secondaryButtonText, {fontWeight: 'bold'}]}
            />
          </View>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Instant shape recognition</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Drag, drop, resize, rotate and more</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Easily visualize difficult geometry problems</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Designed by students • For students</Text>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header Styles
  headerContainer: {
    alignItems: 'center',
    paddingTop: hp(6),
    paddingBottom: hp(4),
  },
  title: {
    fontSize: wp(8),
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: wp(4),
    color: theme.colors.silver,
    textAlign: 'center',
  },

  // Content Styles
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: hp(6),
    paddingHorizontal: wp(4),
  },
  welcomeTitle: {
    fontSize: wp(7),
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: wp(4.5),
    color: theme.colors.silver,
    textAlign: 'center',
    lineHeight: wp(6),
  },

  // Button Styles
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: hp(6),
  },
  buttonSpacing: {
    marginBottom: hp(2),
    width: '100%',
    maxWidth: wp(80),
  },
  primaryButton: {
    backgroundColor: theme.colors.vividBlue,
    borderRadius: wp(4),
    paddingVertical: hp(2.2),
    paddingHorizontal: wp(4),
    shadowColor: theme.colors.vividBlue,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: wp(4.5),
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.slateGray,
    borderRadius: wp(4),
    paddingVertical: hp(2.2),
    paddingHorizontal: wp(6),
  },
  secondaryButtonText: {
    color: theme.colors.white,
    fontSize: wp(4.5),
    fontWeight: '600',
  },

  // Features Styles
  featuresContainer: {
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: wp(80),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  featureDot: {
    width: wp(2),
    height: wp(2),
    backgroundColor: theme.colors.vividBlue,
    borderRadius: wp(1),
    marginRight: wp(3),
  },
  featureText: {
    color: theme.colors.lightSilver,
    fontSize: wp(3.5),
  },

  // Footer Styles
  footerContainer: {
    alignItems: 'center',
    paddingBottom: hp(4),
  },
  footerText: {
    color: theme.colors.ashGray,
    fontSize: wp(3),
    textAlign: 'center',
  },
})