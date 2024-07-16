import { router, Slot, Stack } from 'expo-router'
import { ActivityIndicator, StatusBar, View } from 'react-native'
import '@/utils/dayjsLocaleConfig'
import '../styles/global.css'

import {
  useFonts,
  Inter_500Medium,
  Inter_400Regular,
  Inter_600SemiBold
} from '@expo-google-fonts/inter'
import { Loading } from '@/components/loading';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { useEffect } from 'react'
import { tokenCache } from '@/storage/token-cache'

const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn) {
      router.replace('(tabs)')
    } else {
      router.replace('(auth)')
    }
  }, [isSignedIn])

  return !isLoaded ? <Loading /> : (
    <View className='flex-1 bg-zinc-950'>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="trip/[id]"
          options={{
            title: "",
            headerTransparent: true,
            presentation: "modal",
          }}
        />
      </Stack>
    </View>
  )
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_400Regular,
    Inter_600SemiBold
  });

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <View className='flex-1 bg-zinc-950'>
        <StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
        <InitialLayout />
      </View>
    </ClerkProvider>
  )
}
