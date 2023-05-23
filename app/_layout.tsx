import { ImageBackground } from 'react-native'
import { styled } from 'nativewind';
import bgBlur from '../src/assets/BgBlur.png'
import Stripes from '../src/assets/Stripes.svg'
import * as SecureStore from 'expo-secure-store'

import { useFonts, Roboto_400Regular, Roboto_700Bold }from '@expo-google-fonts/roboto';
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

const StylesStripe = styled(Stripes)

export default function Layout(){
  const [ isAuthenticated, setisAuthenticated ] = useState<null | boolean>(null)

  useEffect(()=>{
    SecureStore.getItemAsync('Tokem').then(Tokem=>{
      setisAuthenticated(!!Tokem)
    })
  },[])

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
   BaiJamjuree_700Bold,
 })
 
 if(!hasLoadedFonts) {
  return <SplashScreen />
}

  return (
    <ImageBackground 
    source={bgBlur} 
    className='relative flex-1 bg-gray-900'
    imageStyle={{position: 'absolute', left: '-100%'}}
  >
    <StatusBar style='light' translucent/>
    <StylesStripe className='absolute left-2'/>
    
    <Stack screenOptions={{headerShown:false, contentStyle: {backgroundColor: 'transparent'},animation: 'fade'}} >
      <Stack.Screen name='index' redirect={isAuthenticated} />
      <Stack.Screen name='memories'  />
      <Stack.Screen name='newmemory' />
      <Stack.Screen name='memory/id' /> 
    </Stack>
  </ImageBackground>
  )
}