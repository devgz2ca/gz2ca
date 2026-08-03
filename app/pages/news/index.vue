<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-[#1a5276] to-[#11817b] text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">校友动态</h1>
        <p class="text-lg text-white/80">了解二中加拿大校友最新资讯</p>
      </div>
    </div>

    <!-- News List -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#11817b] mx-auto"></div>
        <p class="text-gray-500 mt-4">加载中...</p>
      </div>

      <!-- Error -->
      <div v-else-if="errorMessage" class="text-center py-16">
        <p class="text-red-500">{{ errorMessage }}</p>
        <button @click="loadNews" class="mt-4 px-6 py-2 bg-[#11817b] text-white rounded-lg hover:bg-[#0d6b64] transition-colors">
          重新加载
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="news.length === 0" class="text-center py-16">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p class="text-gray-500 text-lg">暂无校友动态</p>
        <p class="text-gray-400 mt-1">敬请期待最新消息</p>
      </div>

      <!-- News Cards -->
      <div v-else class="space-y-6">
        <div
          v-for="item in news"
          :key="item._id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <div class="p-6 md:p-8">
            <!-- Meta -->
            <div class="flex items-center gap-3 mb-3 text-sm text-gray-500">
              <span>{{ formatDate(item.ts) }}</span>
              <span v-if="item.author" class="flex items-center gap-1">
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{{ item.author.ln }}{{ item.author.fn }}</span>
              </span>
            </div>

            <!-- Title -->
            <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 hover:text-[#11817b] transition-colors">
              {{ item.title }}
            </h2>

            <!-- Summary -->
            <p v-if="item.summary" class="text-gray-600 leading-relaxed mb-4">
              {{ item.summary }}
            </p>

            <!-- Content preview -->
            <div v-if="item.content && !item.summary" class="text-gray-600 leading-relaxed mb-4 line-clamp-3">
              {{ item.content.replace(/<[^>]*>/g, '') }}
            </div>

            <!-- Tags -->
            <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2 mt-4">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="px-3 py-1 bg-[#11817b]/10 text-[#11817b] text-xs rounded-full font-medium"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2 mt-10">
        <button
          v-for="p in pagination.totalPages"
          :key="p"
          @click="goToPage(p)"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            p === pagination.page
              ? 'bg-[#11817b] text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          ]"
        >
          {{ p }}
        </button>
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
const news = ref<any[]>([])
const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 0 })

const loadNews = async (page = 1) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await get(`/api/news?page=${page}&limit=10`)
    if (response.success) {
      news.value = response.news
      pagination.value = response.pagination
    }
  } catch (error: any) {
    errorMessage.value = '加载动态失败'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

const goToPage = (page: number) => {
  loadNews(page)
}

onMounted(() => {
  loadNews()
})

useHead({
  title: `校友动态 - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: '了解广州市第二中学加拿大校友最新动态与活动资讯。' },
    { name: 'keywords', content: '广州二中, 校友动态, 加拿大' }
  ]
})
</script>
