import React from 'react'
import usePhotoboothStore from '../hooks/usePhotoboothStore'
import WelcomeScreen from '../components/screens/WelcomeScreen'
import CameraScreen from '../components/screens/CameraScreen'
import CustomizeScreen from '../components/screens/CustomizeScreen'
import ProcessingScreen from '../components/screens/ProcessingScreen'
import ResultScreen from '../components/screens/ResultScreen'

export default function PhotoboothApp() {
  const currentScreen = usePhotoboothStore(state => state.currentScreen)

  const screens = {
    welcome: <WelcomeScreen />,
    camera: <CameraScreen />,
    customize: <CustomizeScreen />,
    processing: <ProcessingScreen />,
    result: <ResultScreen />,
  }

  return (
    <div className="w-full h-screen bg-white">
      {screens[currentScreen] || screens.welcome}
    </div>
  )
}
