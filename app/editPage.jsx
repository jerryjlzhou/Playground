import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from '../assets/icons'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import { Alert } from 'react-native'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'


const EditPage = () => {
  const params = useLocalSearchParams()
  const { imageUri } = params
  const router = useRouter()

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
        <View style={styles.imageContainer}>
          {imageUri && (
            <Image 
              source={{ uri: imageUri }} 
              style={styles.image} 
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.footer}>
             <View style={styles.icons}>
                <Pressable>
                    <Icon name="draw" size={hp(3.5)} color="white"/>
                </Pressable>

                <Pressable>
                    <Icon name="select" size={hp(3.5)} color="white"/>
                </Pressable>

                <Pressable onPress={handleSave}>
                    <Icon name="save" size={hp(3.5)} color="white"/>
                </Pressable>
            </View>

        </View>

      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(2),
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
  imageContainer: {
    flex: 1,
    backgroundColor: theme.colors.navy,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginBottom: hp(2),
    paddingHorizontal: wp()
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  }
})

export default EditPage