import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'

const Loading = ({size="large", color=theme.colors.gray}) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={size} color={color}></ActivityIndicator>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})