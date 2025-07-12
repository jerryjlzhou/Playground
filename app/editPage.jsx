import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
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

  const handleDraw = () => {
    router.push({
      pathname: '/drawingPage',
      params: { imageUri }
    })
  }

  return (
    <ScreenWrapper bg={theme.colors.midnight}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => {
              router.replace('/');
            }}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Icon name="backbutton" size={hp(3.6)} color={theme.colors.white} />
          </Pressable>
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
        </View>
        


        <View style={styles.footer}>
             <View style={styles.icons}>
                <Button 
                  title="Extract shapes"
                  onPress={handleExtractShapes}
                  buttonStyle={[styles.button]}
                  textStyle={[styles.buttonText, {fontWeight: 'bold'}]}
                />
                
                <Button 
                  title="Draw on Image"
                  onPress={handleDraw}
                  buttonStyle={[styles.secondaryButton]}
                  textStyle={[styles.secondaryButtonText, {fontWeight: 'bold'}]}
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
    padding: wp(4),
    minWidth: wp(12),
    minHeight: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
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
    flexDirection: 'column',
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
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.slateGray,
    borderRadius: wp(4),
    paddingVertical: hp(2.2),
    paddingHorizontal: wp(25),
  },
  secondaryButtonText: {
    color: theme.colors.white,
    fontSize: wp(4.5),
    fontWeight: '600',
  },
})

export default EditPage