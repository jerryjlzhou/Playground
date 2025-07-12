import { Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, RotationGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const imageSources = [
  require('../assets/images/shape_1.png'),
  require('../assets/images/shape_2.png'),
  require('../assets/images/shape_3.png'),
  require('../assets/images/shape_4.png'),
  require('../assets/images/shape_5.png'),
  require('../assets/images/shape_6.png'),
  require('../assets/images/shape_7.png'),
];
const IMAGE_SIZE = 150; // Slightly bigger than before

const Playground = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      {imageSources.map((source, idx) => {
        const numCols = 3;
        const col = idx % numCols;
        const row = Math.floor(idx / numCols);
        // Calculate gap so all images fit within the screen
        const gap = (width - (numCols * IMAGE_SIZE)) / (numCols + 1);
        // Ensure initialX and initialY keep images within bounds
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
                    <Animated.Image source={source} style={styles.image} resizeMode="contain" />
                  </RotationGestureHandler>
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        );
      })}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});

export default Playground;