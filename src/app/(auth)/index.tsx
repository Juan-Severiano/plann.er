import { ActivityIndicator, Image, Text, View } from "react-native";
import * as Linking from 'expo-linking'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useState } from "react";
import { useOAuth } from "@clerk/clerk-expo";
import { Button } from "@/components/button";

WebBrowser.maybeCompleteAuthSession()

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const googleOAuth = useOAuth({ strategy: 'oauth_google' })
  async function handleSignIn() {
    try {
      setLoading(true)
      const redirectUrl = Linking.createURL('/')
      const oAuthFlow = await googleOAuth.startOAuthFlow({ redirectUrl })

      if (oAuthFlow.authSessionResult?.type === 'success') {
        if (oAuthFlow.setActive) {
          await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId })
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    WebBrowser.warmUpAsync()

    return () => {
      WebBrowser.coolDownAsync()
    }
  }, [])

  return (
    <View className="flex-1 w-full justify-center items-center px-4 bg-zinc-950">
      <Image
        source={require('@/assets/logo.png')}
        className='h-8 mb-3'
        resizeMode='contain'
      />
      <Image
        source={require('@/assets/bg.png')}
        className='absolute'
      />
      <Text className='text-zinc-400 font-regular text-center text-lg my-3'>
        Convide seus amigos e planeje sua {"\n"} próxima viagem
      </Text>
      <Button onPress={handleSignIn} isLoading={loading} className="mt-3 w-full">
        <Ionicons name="logo-google" disabled={loading} size={20} />
        <Button.Title>Entrar com o google</Button.Title>
      </Button>
    </View>
  )
}
