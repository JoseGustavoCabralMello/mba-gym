import {
  Roboto_400Regular as Roboto400Regular,
  Roboto_700Bold as Roboto700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { StatusBar } from 'react-native'

import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from './config/gluestack-ui.config'
import { Loading } from '@components/Loading'
import { Routes } from '@routes/index'
import { AuthContext } from '@contexts/AuthContext'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto700Bold, Roboto400Regular })

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContext.Provider
        value={{
          user: {
            id: '1',
            name: 'Rodrigo Gonçalves',
            email: 'rodrigo@email.com',
            avatar: 'rodrigo.png',
          },
        }}
      >
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContext.Provider>
    </GluestackUIProvider>
  )
}
