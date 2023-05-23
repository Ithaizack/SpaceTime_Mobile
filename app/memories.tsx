import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import Icon from "@expo/vector-icons/Feather"
import * as secureStore from 'expo-secure-store'

import NlwLogo from '../src/assets/logo.svg'
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from 'react'
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br"
import { api } from "../src/lib/api";

dayjs.locale(ptBR)

interface Memory {
  coverUrl: string
  excerpt: string
  createdAt: string
  id: string
}

export default function Memories(){
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [memories,setMemories] = useState<Memory[]>([]) 

  async function singOut() {
    await secureStore.deleteItemAsync("Tokem")

    router.push('/')
  }


  async function loadMemories() {
    const Tokem = await secureStore.getItemAsync("Tokem")

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${Tokem}`,
      },
    })
    setMemories(response.data)
  }

  useEffect(()=>{
    loadMemories()
  },[])

  return(
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }} >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NlwLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={singOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/newmemory" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View className="mt-6 space-y-10">
        {memories.map((memory) => {
          return (
            <View key={memory.id} className="space-y-4">
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-sm text-gray-100">
                  {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
                </Text>
              </View>
              <View className="space-y-4 px-8">
                <Image
                  source={{
                    uri: memory.coverUrl,
                  }}
                  className="aspect-video w-full rounded-lg"
                  alt=""
                />
                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </Text>
                <Link href={`/memory/${memory.id}`} asChild>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="font-body text-sm text-gray-200">
                      Ler mais
                    </Text>
                    <Icon name="arrow-right" size={16} color="#9e9ea0" />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          )
        })}
        </View>
    </ScrollView>
  )
}