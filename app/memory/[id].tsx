import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Link } from "expo-router";
import Icon from '@expo/vector-icons/Feather'
import { useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context"
import * as secureStore from 'expo-secure-store'
import NlwLogo from '../../src/assets/logo.svg'
import { api } from "../../src/lib/api";

interface Memory{
  content: string,
  coverUrl: string,
  createdAt: string,
  isPublic: Boolean,
  id: string,
  usersId: string,
}

export default function MemoryId(){
  const { id } = useSearchParams()
  const { bottom , top } = useSafeAreaInsets()

  const [ memoryData , setMemoryData ] = useState<Memory | null>(null)

  async function fetchesMemoryData() {
    const Tokem = await secureStore.getItemAsync("Tokem")
    const resolverMemory = await api.get(`/memories/${id}`,{
      headers: {
        Authorization: `Bearer ${Tokem}`,
      },
    })
    setMemoryData(resolverMemory.data)
  }

  console.log(memoryData)

  useEffect(()=>{
    fetchesMemoryData()
  },[])

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
        <TouchableOpacity
        activeOpacity={0.7}
        className="h-32 justify-center items-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          <Image source={{uri:memoryData?.coverUrl}} className="h-full w-full rounded-lg object-cover"/>
        </TouchableOpacity>

        <Text className="p-0 font-body text-lg text-gray-50">
            {memoryData?.content ? memoryData?.content : ''}
        </Text>
      </View>
    </ScrollView>
  )
}