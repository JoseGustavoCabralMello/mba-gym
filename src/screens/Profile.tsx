import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Center, Heading, Text, useToast, VStack } from '@gluestack-ui/themed'
import { ScrollView, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import * as FileSystem from 'expo-file-system'
import { ToastMessage } from '@components/ToastMessage'
import { useAuth } from '@hooks/useAuth'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

type FormDataProps = {
  name: string
  email: string
  password: string
  old_password: string
  confirm_password: string
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => value || null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: unknown) => Field,
      then: yup
        .string()
        .nullable()
        .required('Informe a confirmação da senha.')
        .transform((value) => value || null),
    }),
})

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [userPhoto, setUserPhoto] = useState(
    'https://github.com/arthurrios.png',
  )

  const toast = useToast()
  const { user } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  })

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoUri = photoSelected.assets[0].uri

      if (photoUri) {
        const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
          size: number
        }

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Ops!"
                description="Essa imagem é muito grande. Escolha uma de até 5MB."
                action="error"
                onClose={() => toast.close(id)}
              />
            ),
          })
        }

        setUserPhoto(photoSelected.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    }

    async function handleProfileUpdate(data: FormDataProps) {
      try {
        setIsUpdating(true)
        await api.put('/users', data)

        toast.show({
          title: 'Perfil atualizado com sucesso!',
          placement: 'top',
          bgColor: 'green.500',
        })
      } catch (error) {
        const isAppError = error instanceof AppError
        const title = isAppError
          ? error.message
          : 'Não foi possível atualizar os dados. Tente novamente mais tarde.'

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500',
        })
      } finally {
        setIsUpdating(false)
      }
    }

    return (
      <VStack flex={1}>
        <ScreenHeader title="Perfil" />

        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          <Center mt="$6" px="$10">
            <UserPhoto
              source={{ uri: userPhoto }}
              size="xl"
              alt="Imagem do usuário"
            />

            <TouchableOpacity onPress={handleUserPhotoSelect}>
              <Text
                color="$green500"
                fontFamily="$heading"
                fontSize="$md"
                mt="$2"
                mb="$8"
              >
                Alterar Foto
              </Text>
            </TouchableOpacity>

            <Center w="$full" gap="$4">
              <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                  <Input
                    bg="gray.600"
                    placeholder="Nome"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.name?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <Input
                    bg="gray.600"
                    placeholder="E-mail"
                    // isDisabled
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </Center>

            <Heading
              alignSelf="flex-start"
              fontFamily="$heading"
              color="$gray200"
              fontSize="$md"
              mt="$12"
              mb="$2"
            >
              Alterar senha
            </Heading>

            <Center w="$full" gap="$4">
              <Controller
                control={control}
                name="old_password"
                render={({ field: { onChange } }) => (
                  <Input
                    bg="gray.600"
                    placeholder="Senha antiga"
                    secureTextEntry
                    onChangeText={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange } }) => (
                  <Input
                    bg="gray.600"
                    placeholder="Nova senha"
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirm_password"
                render={({ field: { onChange } }) => (
                  <Input
                    bg="gray.600"
                    placeholder="Confirme a nova senha"
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.confirm_password?.message}
                  />
                )}
              />

              <Button
                title="Atualizar"
                mt={4}
                onPress={handleSubmit(handleProfileUpdate)}
                isLoading={isUpdating}
              />
            </Center>
          </Center>
        </ScrollView>
      </VStack>
    )
  }
}
