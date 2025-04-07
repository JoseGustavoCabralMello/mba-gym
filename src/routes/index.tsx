import { DefaultTheme, NavigationContainer } from '@react-navigation/native'

import { AuthRoutes } from './auth.routes'
import { Box } from '@gluestack-ui/themed'
import { gluestackUIConfig } from '../../config/gluestack-ui.config'
import { AppRoutes } from './app.routes'
import { useContext } from 'react'
import { AuthContext } from '@contexts/AuthContext'
import { useAuth } from '@hooks/useAuth'

export function Routes() {
  const { user } = useAuth()

  console.log('USUÁRIO LOGADO =>', user)

  const theme = DefaultTheme
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  )
}
