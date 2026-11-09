<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <div class="bg-gradient-to-br from-[#1a5276] to-[#11817b] text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">活动相册</h1>
        <p class="text-lg text-white/80">回顾校友活动的精彩瞬间</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#11817b] mx-auto"></div>
        <p class="text-gray-500 mt-4">加载中...</p>
      </div>

      <div v-else-if="errorMessage" class="text-center py-16">
        <p class="text-gray-600">{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-4 px-6 py-2 bg-[#11817b] text-white rounded-lg hover:bg-[#0d6b64] transition-colors text-sm"
          @click="loadGallery"
        >
          重试
        </button>
      </div>

      <div v-else-if="media.length === 0" class="text-center py-16">
        <p class="text-gray-500 text-lg">暂无活动照片</p>
      </div>

      <div v-else>
        <p class="text-sm text-gray-500 mb-4">共 {{ media.length }} 张照片</p>
        <EventDetailGallery :media="media" :can-delete="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EventDetailGallery from '~/components/event/EventDetailGallery.vue'
import { SITE_NAME } from '~/constants'
import { get } from '~/utils/http'

interface GalleryMedia {
  _id: string
  event_id: string
  src: string
  thumb: string
  ts: string
  event_name: string
}

const loading = ref(true)
const errorMessage = ref('')
const media = ref<GalleryMedia[]>([])

const loadGallery = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await get<{
      success: boolean
      media: GalleryMedia[]
      message?: string
    }>('/api/media')

    if (!response.success) {
      throw new Error(response.message || '加载相册失败')
    }
    media.value = response.media
  } catch (error) {
    console.error('Failed to load gallery:', error)
    errorMessage.value = '加载相册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(loadGallery)

useHead({
  title: `活动相册 - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: '浏览广州市第二中学加拿大校友活动照片，回顾精彩瞬间。' }
  ]
})
</script>
