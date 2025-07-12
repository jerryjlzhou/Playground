import { View } from 'react-native';

const ScreenWrapper = ({children, bg}) => {
  return (
    <View style={{flex: 1, backgroundColor: bg}}>
      {children}
    </View>
  )
}

export default ScreenWrapper