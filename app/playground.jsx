import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, RotationGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import BackButtonIcon from '../assets/icons/BackButton.jsx';
import { theme } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const MAX_SIZE = 150; // Maximum size for any dimension
const MIN_SIZE = 50;  // Minimum size for any dimension

const Playground = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [imageSizes, setImageSizes] = useState([]);
  
  // Get shapes from route params, fallback to default shapes if none provided
  let imageSources = [];
  
  try {
    const shapesParam = params.shapes;
    if (shapesParam) {
      const shapeBase64List = JSON.parse(shapesParam);
      imageSources = shapeBase64List.map(base64 => ({ uri: `data:image/png;base64,${base64}` }));
    }
  } catch (error) {
    console.error('Error parsing shapes:', error);
  }
  
  // Fallback to default shapes if no processed shapes available
  if (imageSources.length === 0) {
    imageSources = [
      require('../assets/images/shape_1.png'),
      require('../assets/images/shape_2.png'),
      require('../assets/images/shape_3.png'),
      require('../assets/images/shape_4.png'),
      require('../assets/images/shape_5.png'),
      require('../assets/images/shape_6.png'),
      require('../assets/images/shape_7.png'),
    ];
  }

  // Get image dimensions for each source
  useEffect(() => {
    const getImageDimensions = async () => {
      const sizes = await Promise.all(
        imageSources.map((source) => {
          return new Promise((resolve) => {
            Image.getSize(
              source.uri || Image.resolveAssetSource(source).uri,
              (width, height) => {
                // Calculate size while maintaining aspect ratio
                const aspectRatio = width / height;
                let displayWidth, displayHeight;
                
                if (width > height) {
                  // Landscape orientation
                  displayWidth = Math.min(width, MAX_SIZE);
                  displayHeight = displayWidth / aspectRatio;
                } else {
                  // Portrait orientation
                  displayHeight = Math.min(height, MAX_SIZE);
                  displayWidth = displayHeight * aspectRatio;
                }
                
                // Ensure minimum size
                if (displayWidth < MIN_SIZE) {
                  displayWidth = MIN_SIZE;
                  displayHeight = displayWidth / aspectRatio;
                }
                if (displayHeight < MIN_SIZE) {
                  displayHeight = MIN_SIZE;
                  displayWidth = displayHeight * aspectRatio;
                }
                
                resolve({ width: displayWidth, height: displayHeight });
              },
              () => {
                // Fallback if image size can't be determined
                resolve({ width: 120, height: 120 });
              }
            );
          });
        })
      );
      setImageSizes(sizes);
    };

    getImageDimensions();
  }, [imageSources]);
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
        {imageSources.slice().reverse().map((source, idx) => {
          // Use calculated size or fallback (reverse the index for size lookup)
          const originalIdx = imageSources.length - 1 - idx;
          const imageSize = imageSizes[originalIdx] || { width: 120, height: 120 };
          
          const numCols = 2; // Reduced from 3 to 2 for more spacing
          const col = idx % numCols;
          const row = Math.floor(idx / numCols);
          // Calculate gap with more generous spacing
          const horizontalGap = (width - (numCols * imageSize.width)) / (numCols + 1);
          const verticalGap = 40; // Increased from 24px to 40px
          // Ensure initialX and initialY keep images within bounds with padding
          const screenPadding = 20; // Add padding from screen edges
          const initialX = Math.max(horizontalGap + col * (imageSize.width + horizontalGap), screenPadding);
          const initialY = 60 + row * (imageSize.height + verticalGap); // Increased from 32px to 60px top margin
          const translateX = useSharedValue(initialX);
          const translateY = useSharedValue(initialY);
          const scale = useSharedValue(1);
          const rotation = useSharedValue(0);
          // ...existing gesture handlers...
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
            width: imageSize.width,
            height: imageSize.height,
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
                      <Animated.Image 
                        source={source} 
                        style={{ width: imageSize.width, height: imageSize.height }} 
                        resizeMode="contain" 
                      />
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
});

export default Playground;