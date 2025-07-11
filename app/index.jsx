import { StyleSheet, View } from 'react-native'
import Button from '../components/Button'
import ScreenWrapper from '../components/ScreenWrapper'
import { hp, wp } from '../helpers/common'

/* 
TODO: 
  1) center buttons
  2) fix ugly design
  3) onpress methods to open camera / upload image
  4) router transition to playground page
*/


const home = () => {
  return (
    <ScreenWrapper>
      <View>
        <Button 
          title="Take a photo"
          buttonStyle={{marginHorizontal: wp(3)}}
        />
      </View>

      <View style={{marginTop: hp(2)}}>
        <Button 
          title="Upload an image"
          buttonStyle={{marginHorizontal: wp(3)}}
        />
      </View>



    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({



})