import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.midnight }}
      // include the top so it covers the status‐bar safe area
      edges={['top', 'left', 'right']}
    >
      {/* 
        style="light" makes the icons/text white
        backgroundColor here ensures Expo inserts a native view behind the bar 
      */}
      <StatusBar
        style="light"
        backgroundColor={theme.colors.midnight}
        translucent={false}
      />

      {/* all your screens */}
      <Slot />
    </SafeAreaView>
  );
}