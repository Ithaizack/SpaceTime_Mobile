import { View, Text, TouchableOpacity, Switch, TextInput, ScrollView, Image } from "react-native";
import NlwLogo from '../src/assets/logo.svg'
import { Link } from "expo-router";
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as secureStote from 'expo-secure-store'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from "expo-router";
import { api } from "../src/lib/api";

export default function NewMemory(){
  const router = useRouter()

  const { bottom, top } = useSafeAreaInsets()

  const [stateMedia,setStateMedia] = useState<string | null>(null)
  const [ content , setContent ]= useState('')
  const [ isPublic , setisPublic ]= useState(false)

  async function handleCreateMemory(){
    const Tokem = await secureStote.getItemAsync('Tokem')

    let coverUrl = ''

    if(stateMedia){
      const uploadFormData = new FormData()

      uploadFormData.append('file',{
        uri: stateMedia,
        name: 'Imagem.jpg',
        type: 'image/jpg'
      } as any)

      const uploadResponse = await api.post('/upload',uploadFormData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      coverUrl = uploadResponse.data

      await api.post(
        '/memories',
        {
          content,
          isPublic,
          coverUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${Tokem}`,
          },
        },
      )
  
      router.push('/memories')
    }
  }

  async function openImagePick(){

    try{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if(result.assets[0]){
        setStateMedia(result.assets[0].uri)
      }

    }catch(err){
      console.log(err)
    }
  }

  return(
    <ScrollView className="flex-1 px-8" contentContainerStyle={{paddingBottom: bottom, paddingTop: top}}>
      <View className="mt-4 flex-row items-center justify-between">
        <NlwLogo/>

        <Link href={'/memories'} asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#ffffff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch onValueChange={()=>{setisPublic(!isPublic)}} value={isPublic} trackColor={{false: '#767577', true:'#372560'}} thumbColor={isPublic ? "#9b79ea" : "#9e9ea0"} />
          <Text className="font-body text-base text-gray-200" >Tornar memoria pública</Text>
        </View>

        <TouchableOpacity
        activeOpacity={0.7}
        onPress={openImagePick}
        className="h-32 justify-center items-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {stateMedia ? (
            <Image source={{uri:stateMedia}} className="h-full w-full rounded-lg object-cover"/>
          ) 
          : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
            )}
        </TouchableOpacity>

        <TextInput
        multiline
        value={content}
        onChangeText={setContent}
        className="p-0 font-body text-lg text-gray-50"
        placeholderTextColor="#56565a"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCreateMemory}
          className='rounded-full bg-green-500 px-5 items-center self-end py-2'
        >
          <Text className='font-alt text-sm uppercase text-black'>Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}