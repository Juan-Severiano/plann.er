import { View, Text, Image } from 'react-native'

import { LogOutIcon } from 'lucide-react-native'
import { colors } from '@/styles/colors'
import { Button } from '@/components/button'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { tripStorage } from '@/storage/trip'

export default function Page() {
  const { user } = useUser()
  const { signOut } = useAuth()

  async function handleSignOut() {
    await tripStorage.remove()
    await signOut()
  }

  return (
    <View className='flex-1 items-center pt-16 px-5 bg-zinc-950'>
      <Image
        source={require('@/assets/logo.png')}
        className='h-8 my-12'
        resizeMode='contain'
      />
      <Image
        source={{ uri: user?.imageUrl }}
        className='h-48 w-48 rounded-full'
        resizeMode='contain'
      />
      <Image
        source={require('@/assets/bg.png')}
        className='absolute'
      />
      <Text className='text-zinc-400 font-regular text-center text-lg mt-3'>
        Olá, <Text className='text-zinc-200 font-semibold text-center text-lg mt-3'>{user?.fullName}</Text>
      </Text>
      <Text className='text-zinc-400 font-regular text-center text-lg mt-3'>
        Seja bem vindo a sua conta
      </Text>

      <Button className='w-full mt-auto mb-10' variant='error' onPress={handleSignOut}>
        <Button.Title>Sair</Button.Title>
        <LogOutIcon color={colors.zinc[300]} />
      </Button>
    </View>
  )
}
