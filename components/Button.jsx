import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import Loading from '../components/Loading'


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
        backgroundColor: theme.colors.yellow,
        height: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl
    },
    text: {
        fontSize: hp(2.5),
        color: 'black',
        fontWeight: theme.fonts.bold
    }
})