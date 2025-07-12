import { Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, RotationGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const imageSource = require('../assets/images/Q1/shape_1.png');
const IMAGE_SIZE = 200;

const Playground = () => {
  // Shared values for position, scale, and rotation
  const translateX = useSharedValue((width - IMAGE_SIZE) / 2);
  const translateY = useSharedValue((height - IMAGE_SIZE) / 2);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Pan gesture
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

  // Pinch gesture
  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = ctx.startScale * event.scale;
    },
  });

  // Rotation gesture
  const rotateHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startRotation = rotation.value;
    },
    onActive: (event, ctx) => {
      rotation.value = ctx.startRotation + event.rotation;
    },
  });

  // Animated style
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
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={panHandler}>
        <Animated.View style={animatedStyle}>
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.View>
              <RotationGestureHandler onGestureEvent={rotateHandler}>
                <Animated.Image source={imageSource} style={styles.image} resizeMode="contain" />
              </RotationGestureHandler>
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: 'white',
  },
});

export default Playground;