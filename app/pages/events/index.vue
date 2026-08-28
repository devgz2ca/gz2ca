<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-[#1a5276] to-[#11817b] text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">校友活动</h1>
        <p class="text-lg text-white/80">广州二中加拿大校友聚会与活动</p>
      </div>
    </div>

    <!-- Events Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">活动列表</h2>
          <p class="text-gray-500 mt-1">查看即将举行和往期的校友活动</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="filterView = filter.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filterView === filter.value
                ? 'bg-[#11817b] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ filter.tl }}
          </button>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <span class="text-sm font-medium text-gray-700">活动分类</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category.value"
            type="button"
            @click="filterCategory = category.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filterCategory === category.value
                ? 'bg-[#11817b] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ category.tl }}
          </button>
        </div>
      </div>

      <EventList
        :events="displayedEvents"
        :loading="loading"
        :error-message="errorMessage"
        empty-message="暂无校友活动"
        :columns="3"
      >
        <template v-if="errorMessage" #error-actions>
          <button @click="loadEvents" class="mt-4 px-6 py-2 bg-[#11817b] text-white rounded-lg hover:bg-[#0d6b64] transition-colors text-sm">
            <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            刷新
          </button>
        </template>
      </EventList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import EventList from '~/components/event/EventList.vue'
import { get } from '~/utils/http'
import { SITE_NAME } from '~/constants'

const loading = ref(true)
const errorMessage = ref('')
const events = ref<any[]>([])
const filterView = ref<string>('all')
const filterCategory = ref<string>('all')

const filters = [
  { tl: '全部', value: 'all' },
  { tl: '即将举行', value: 'upcoming' },
  { tl: '往期活动', value: 'past' }
]

const categories = [
  { tl: '全部', value: 'all' },
  { tl: '活动', value: 'event' },
  { tl: '餐厅', value: 'restaurant' },
  { tl: '教程/博客', value: 'tutorial' }
]

const displayedEvents = computed(() => {
  const now = new Date()
  return events.value.filter((event: any) => {
    const matchesCategory = filterCategory.value === 'all' || event.category === filterCategory.value
    const eventDate = new Date(event.date)

    if (!matchesCategory) return false
    if (filterView.value === 'upcoming') return eventDate >= now
    if (filterView.value === 'past') return eventDate < now
    return true
  })
})

const loadEvents = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await get('/api/events')
    if (response.success) {
      events.value = response.events
    }
  } catch (error: any) {
    errorMessage.value = '加载活动失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEvents()
})

useHead({
  title: `校友活动 - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: '查看广州市第二中学加拿大校友聚会与活动安排。' },
    { name: 'keywords', content: '广州二中, 校友活动, 聚会, 加拿大' }
  ]
})
</script>
