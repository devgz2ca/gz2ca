<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-[#1a5276] to-[#11817b] text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">校友相册</h1>
        <p class="text-lg text-white/80">记录校友活动的精彩瞬间</p>
      </div>
    </div>

    <!-- Gallery Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#11817b] mx-auto"></div>
        <p class="text-gray-500 mt-4">加载中...</p>
      </div>

      <!-- Error -->
      <div v-else-if="errorMessage" class="text-center py-16">
        <p class="text-red-500">{{ errorMessage }}</p>
        <button @click="loadPhotos" class="mt-4 px-6 py-2 bg-[#11817b] text-white rounded-lg hover:bg-[#0d6b64] transition-colors">
          重新加载
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="allPhotos.length === 0" class="text-center py-16">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500 text-lg">暂无活动照片</p>
        <p class="text-gray-400 mt-1">参加校友活动并分享您的照片</p>
      </div>

      <!-- Photo Grid -->
      <div v-else>
        <!-- Masonry Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="photo in allPhotos"
            :key="photo._id"
            class="group relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer aspect-square"
            @click="openLightbox(photo)"
          >
            <img
              v-if="photo.url"
              :src="photo.url"
              :alt="photo.title || '校友活动照片'"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
              <div class="p-3 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p v-if="photo.title" class="text-white text-sm font-medium truncate">{{ photo.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div
      v-if="selectedPhoto"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      @click="selectedPhoto = null"
    >
      <button
        @click="selectedPhoto = null"
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        :src="selectedPhoto.url"
        :alt="selectedPhoto.title || '照片预览'"
        class="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
        @click.stop
      />
      <div v-if="selectedPhoto.title" class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-lg font-medium bg-black/50 px-6 py-2 rounded-full">
        {{ selectedPhoto.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { get } from '~/utils/http'
import { SITE_NAME } from '~/constants'

const loading = ref(true)
const errorMessage = ref('')
const allPhotos = ref<any[]>([])
const selectedPhoto = ref<any>(null)

const loadPhotos = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // Load events with photos
    const response = await get('/api/events')
    if (response.success && response.events) {
      const photos: any[] = []
      response.events.forEach((event: any) => {
        // Collect event cover images
        if (event.coverImage) {
          photos.push({
            _id: `cover-${event._id}`,
            url: event.coverImage,
            title: event.title,
            eventId: event._id
          })
        }
        // Collect event description images (if stored as HTML content with images)
        if (event.description) {
          const imgRegex = /<img[^>]+src="([^">]+)"/g
          let match
          while ((match = imgRegex.exec(event.description)) !== null) {
            photos.push({
              _id: `img-${event._id}-${photos.length}`,
              url: match[1],
              title: event.title,
              eventId: event._id
            })
          }
        }
      })
      allPhotos.value = photos
    }
  } catch (error: any) {
    errorMessage.value = '加载照片失败'
  } finally {
    loading.value = false
  }
}

const openLightbox = (photo: any) => {
  selectedPhoto.value = photo
}

onMounted(() => {
  loadPhotos()
})

useHead({
  title: `校友相册 - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: '查看广州市第二中学加拿大校友活动精彩照片。' },
    { name: 'keywords', content: '广州二中, 校友相册, 活动照片, 加拿大' }
  ]
})
</script>
