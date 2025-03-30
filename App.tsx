import {
  Roboto_400Regular as Roboto400Regular,
  Roboto_700Bold as Roboto700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { StatusBar, Text, View } from 'react-native'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto700Bold, Roboto400Regular })
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#202024',
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? <Text>Home</Text> : <View />}
    </View>
  )
}
