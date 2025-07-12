import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from '../assets/icons'
import Button from '../components/Button'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'

const EditPage = () => {
  const params = useLocalSearchParams()
  const { imageUri } = params
  const router = useRouter()

  const handleExtractShapes = async () => {
    router.push('/playground');
  }

  const handleSave = async () => {
    
    try {
      // 1. Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission required', 
          'Please grant permission to save images to your photo library'
        )
        return
      }
      
      // 2. Get file info
      const fileInfo = await FileSystem.getInfoAsync(imageUri)
      
      if (!fileInfo.exists) {
        throw new Error('Image file not found')
      }
      
      // 3. Save to gallery
      const asset = await MediaLibrary.createAssetAsync(imageUri)
      await MediaLibrary.createAlbumAsync('Playground', asset, false)
      
      Alert.alert(
        'Saved!', 
        'Image has been saved to your photo library'
      )
    } catch (error) {
      console.error('Save failed:', error)
      Alert.alert(
        'Save failed', 
        error.message || 'Could not save the image'
      )
    } 
  }

  return (
    <ScreenWrapper bg={theme.colors.midnight}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="backbutton" size={hp(3.6)} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Image</Text>
          <View style={{ width: wp(10) }} />
        </View>
        
        {/* Image Preview */}
        <View style={{ flex: 1, width: '100%', marginTop: hp(-10), marginBottom: hp(2), position: 'relative' }}>
          <Image
            source={{ uri: imageUri }}
            style={{ flex: 1, width: undefined, height: undefined }}
            resizeMode="contain"
          />
          {/* Icons on the right, horizontal and a bit lower */}
          <View style={{ position: 'absolute', right: wp(4), bottom: hp(10), flexDirection: 'row', alignItems: 'center', gap: wp(4) }}>
            <Pressable>
                <Icon name="draw" size={hp(3.5)} color="white"/>
            </Pressable>

            <Pressable onPress={handleSave}>
                <Icon name="save" size={hp(3.5)} color="white"/>
            </Pressable>
          </View>
        </View>
        


        <View style={styles.footer}>
             <View style={styles.icons}>
                <Button 
                  title="Extract shapes"
                  onPress={handleExtractShapes}
                  buttonStyle={[styles.button]}
                  textStyle={[styles.buttonText, {fontWeight: 'bold'}]}
                />
            </View>

        </View>

      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(0),
    paddingTop: hp(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(0),
  },
  backButton: {
    padding: wp(2),
  },
  backButtonText: {
    color: theme.colors.white,
    fontSize: wp(6),
  },
  title: {
    color: theme.colors.white,
    fontSize: wp(5),
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(1), // slightly higher
    marginBottom: hp(5), // add a bit of space from the bottom
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
    buttonSpacing: {
    marginBottom: hp(2),
    width: '100%',
    maxWidth: wp(80),
  },
  button: {
    backgroundColor: theme.colors.vividBlue,
    borderRadius: wp(4),
    paddingVertical: hp(2.2),
    paddingHorizontal: wp(25),
    shadowColor: theme.colors.vividBlue,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: wp(4.5),
    fontWeight: '600',
  },
})

export default EditPage