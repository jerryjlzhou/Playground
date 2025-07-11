import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenWrapper = ({children, bg}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: bg}} edges={['top', 'bottom', 'left', 'right']}>
      {children}
    </SafeAreaView>
  )
}

export default ScreenWrapper