import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import Icon from '../assets/icons'
import Button from '../components/Button'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'

const { width, height } = Dimensions.get('window')

const DrawingPage = () => {
  const params = useLocalSearchParams()
  const { imageUri } = params
  const router = useRouter()
  
  const [paths, setPaths] = useState([])
  const [currentPath, setCurrentPath] = useState('')
  const isDrawing = useRef(false)

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent
    const newPath = `M${locationX},${locationY}`
    setCurrentPath(newPath)
    isDrawing.current = true
  }

  const handleTouchMove = (event) => {
    if (!isDrawing.current) return
    const { locationX, locationY } = event.nativeEvent
    setCurrentPath(prev => prev + ` L${locationX},${locationY}`)
  }

  const handleTouchEnd = () => {
    if (isDrawing.current && currentPath) {
      setPaths(prevPaths => [...prevPaths, currentPath])
      setCurrentPath('')
      isDrawing.current = false
    }
  }

  const clearDrawing = () => {
    setPaths([])
    setCurrentPath('')
  }

  const undoLastStroke = () => {
    if (paths.length > 0) {
      setPaths(prevPaths => prevPaths.slice(0, -1))
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="backbutton" size={hp(3.6)} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Draw on Image</Text>
        <TouchableOpacity onPress={clearDrawing} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Drawing Area */}
      <View style={styles.drawingContainer}>
        {/* Background Image */}
        <Image
          source={{ uri: imageUri }}
          style={styles.backgroundImage}
          resizeMode="contain"
        />
        
        {/* Drawing Overlay */}
        <View 
          style={styles.svgContainer}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
          onResponderRelease={handleTouchEnd}
        >
          <Svg style={styles.svgCanvas} width="100%" height="100%">
            {/* Render all completed paths */}
            {paths.map((path, index) => (
              <Path
                key={`path-${index}`}
                d={path}
                stroke={theme.colors.red}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
            {/* Render current path being drawn */}
            {currentPath !== '' && (
              <Path
                key="current-path"
                d={currentPath}
                stroke={theme.colors.red}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </Svg>
        </View>
      </View>

      {/* Tools Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={undoLastStroke} style={styles.toolButton}>
          <Text style={styles.toolText}>Undo ({paths.length})</Text>
        </TouchableOpacity>
        
        <Button 
          title="Save Drawing"
          onPress={() => {
            router.back()
            // Could implement actual save functionality here
          }}
          buttonStyle={styles.saveButton}
          textStyle={styles.saveButtonText}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.midnight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: hp(6),
    paddingBottom: hp(2),
    backgroundColor: theme.colors.midnight,
  },
  backButton: {
    padding: wp(2),
  },
  title: {
    color: theme.colors.white,
    fontSize: wp(5),
    fontWeight: '600',
  },
  clearButton: {
    padding: wp(2),
  },
  clearText: {
    color: theme.colors.red,
    fontSize: wp(4),
    fontWeight: '600',
  },
  drawingContainer: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  svgCanvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    paddingTop: hp(2),
    backgroundColor: theme.colors.midnight,
  },
  toolButton: {
    backgroundColor: theme.colors.slateGray,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(3),
  },
  toolText: {
    color: theme.colors.white,
    fontSize: wp(4),
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: theme.colors.vividBlue,
    borderRadius: wp(4),
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: wp(4.5),
    fontWeight: '600',
  },
})

export default DrawingPage
