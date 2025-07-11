import { Pressable, StyleSheet, Text, View } from 'react-native'
import Loading from '../components/Loading'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'

const Button = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    loading = false,
    hasShadow = true,
}) => {
    const shadowStyle = {
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
    }

    // loading state
    if (loading) {
        return (
            <View style={[styles.button, buttonStyle, {backgroundColor: 'white'}]}>
                <Loading color={theme.colors.darkGray}/>
            </View>
        )
    }
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable> 

  )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.blue,
        paddingVertical: hp(1.5),
        paddingHorizontal: hp(7), 
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl
    },
    text: {
        fontSize: hp(2.5),
        color: 'white',
        fontWeight: theme.fonts.bold
    }
})