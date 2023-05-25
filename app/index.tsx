import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Text, View, TouchableOpacity } from 'react-native';

 import NlwLogo from '../src/assets/logo.svg'
 import { api } from '../src/lib/api';
 
export default function App() {

  const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/settings/connections/applications/093d420f0a9940637575',
  };

  const router = useRouter()
  
  const [request, response, SingInWithGithub] = useAuthRequest(
    {
      clientId: '093d420f0a9940637575',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'SpaceTime'
      }),
    },
    discovery
  );

  async function isLoginGithub(code){

    const response = await api.post('/register/mobile',{
      code,
    })

    const {Tokem} = response.data
    await SecureStore.setItemAsync('Tokem',Tokem)
    router.push('/memories')
  }

  useEffect(() => {

    if (response?.type === 'success') {
      const { code } = response.params;
      isLoginGithub(code)
    }
  }, [response]);

  return (
    <View 
      className='flex-1 items-center px-8 py-10'
    >
      <View className='flex-1 items-center justify-center gap-6'>
        <NlwLogo/>
        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50'>
            Sua cápsula do tempo  
          </Text>
          <Text className='text-center font-body text-base leading-relaxed text-gray-50'>
            Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full bg-green-500 px-5 py-2'
          onPress={()=>{SingInWithGithub()}}
        >
          <Text className='font-alt text-sm uppercase text-black'>Cadastrar lembrança</Text>
        </TouchableOpacity>
      </View>
      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'>
        Feito com 💜 no NLW Rocketseat
      </Text>
    </View>
  );
}
