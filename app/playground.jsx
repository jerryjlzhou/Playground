import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, RotationGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import BackButtonIcon from '../assets/icons/BackButton.jsx';
import { theme } from '../constants/theme';

const { width, height } = Dimensions.get('window');
const IMAGE_SIZE = 150; // Slightly bigger than before

const Playground = () => {
  const navigation = useNavigation();
  const [imageSources, setImageSources] = useState([]);

  useEffect(() => {
    const fetchProcessedImages = async () => {
      try {
        const response = await fetch('http://localhost:3001/processed-images');
        if (response.ok) {
          const imageUrls = await response.json();
          setImageSources(imageUrls);
        } else {
          console.error('Failed to fetch processed images.');
        }
      } catch (error) {
        console.error('Error fetching processed images:', error);
      }
    };

    fetchProcessedImages();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <BackButtonIcon color='white' width={28} height={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playground</Text>
        <View style={{ width: 40 }} />
      </View>
      <GestureHandlerRootView style={styles.container}>
        {imageSources.map((source, idx) => {
          const numCols = 3;
          const col = idx % numCols;
          const row = Math.floor(idx / numCols);
          const gap = (width - (numCols * IMAGE_SIZE)) / (numCols + 1);
          const initialX = Math.max(gap + col * (IMAGE_SIZE + gap), 0);
          const initialY = 32 + row * (IMAGE_SIZE + 24); // 32px from top, 24px vertical gap
          const translateX = useSharedValue(initialX);
          const translateY = useSharedValue(initialY);
          const scale = useSharedValue(1);
          const rotation = useSharedValue(0);
          const panHandler = useAnimatedGestureHandler({
            onStart: (_, ctx) => {
              ctx.startX = translateX.value;
              ctx.startY = translateY.value;
            },
            onActive: (event, ctx) => {
              translateX.value = ctx.startX + event.translationX;
              translateY.value = ctx.startY + event.translationY;
            },
          });
          const pinchHandler = useAnimatedGestureHandler({
            onStart: (_, ctx) => {
              ctx.startScale = scale.value;
            },
            onActive: (event, ctx) => {
              scale.value = ctx.startScale * event.scale;
            },
          });
          const rotateHandler = useAnimatedGestureHandler({
            onStart: (_, ctx) => {
              ctx.startRotation = rotation.value;
            },
            onActive: (event, ctx) => {
              rotation.value = ctx.startRotation + event.rotation;
            },
          });
          const animatedStyle = useAnimatedStyle(() => ({
            position: 'absolute',
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            transform: [
              { translateX: translateX.value },
              { translateY: translateY.value },
              { scale: scale.value },
              { rotateZ: `${rotation.value}rad` },
            ],
          }));
          return (
            <PanGestureHandler key={idx} onGestureEvent={panHandler}>
              <Animated.View style={animatedStyle}>
                <PinchGestureHandler onGestureEvent={pinchHandler}>
                  <Animated.View>
                    <RotationGestureHandler onGestureEvent={rotateHandler}>
                      <Animated.Image source={{ uri: source }} style={styles.image} resizeMode="contain" />
                    </RotationGestureHandler>
                  </Animated.View>
                </PinchGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          );
        })}
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: theme.colors.midnight,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.white,
    textAlign: 'center',
    flex: 1,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});

export default Playground;