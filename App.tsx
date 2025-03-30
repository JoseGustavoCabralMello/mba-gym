import {
  Roboto_400Regular as Roboto400Regular,
  Roboto_700Bold as Roboto700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { StatusBar, Text, View } from 'react-native'

import { Center, GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto700Bold, Roboto400Regular })

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? (
        <Center flex={1} bg="">
          <Text>Home</Text>
        </Center>
      ) : (
        <View />
      )}
    </GluestackUIProvider>
  )
}
