<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-[#1a5276] to-[#11817b] text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">校友名录</h1>
        <p class="text-lg text-white/80">寻找同窗校友，重温二中情谊</p>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">搜索姓名</label>
            <input
              v-model="searchQuery"
              @input="debouncedSearch"
              type="text"
              placeholder="输入姓名搜索..."
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11817b] focus:border-[#11817b] outline-none transition-shadow"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">毕业届别</label>
            <select
              v-model="filterGraduationYear"
              @change="loadAlumni"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11817b] focus:border-[#11817b] outline-none bg-white"
            >
              <option value="">全部届别</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}届</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">所在城市</label>
            <select
              v-model="filterLocation"
              @change="loadAlumni"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11817b] focus:border-[#11817b] outline-none bg-white"
            >
              <option value="">全部地区</option>
              <option v-for="loc in availableLocations" :key="loc" :value="loc">{{ loc }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              重置筛选
            </button>
          </div>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mb-6">
        <p class="text-gray-600">
          共找到 <span class="font-semibold text-[#11817b]">{{ pagination.total }}</span> 位校友
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#11817b] mx-auto"></div>
        <p class="text-gray-500 mt-4">加载中...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!groupedByYear || Object.keys(groupedByYear).length === 0" class="text-center py-16">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-500 text-lg">暂未找到校友</p>
        <p class="text-gray-400 mt-1">调整筛选条件或注册成为第一位校友</p>
      </div>

      <!-- Alumni List Grouped by Year -->
      <div v-else>
        <div v-for="(members, yearGroup) in groupedByYear" :key="yearGroup" class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-2 h-8 bg-[#11817b] rounded-full inline-block"></span>
            {{ yearGroup }}
            <span class="text-sm font-normal text-gray-500">({{ members.length }}人)</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="alumnus in members"
              :key="alumnus._id"
              class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-[#11817b]/30 transition-all duration-300"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#11817b] to-[#1a5276] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {{ getInitials(alumnus) }}
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-semibold text-gray-900 truncate">
                    {{ alumnus.ln }}{{ alumnus.fn }}
                  </h3>
                  <p v-if="alumnus.graduationYear" class="text-xs text-[#11817b] mt-0.5">
                    {{ alumnus.graduationYear }}届
                  </p>
                  <p v-if="alumnus.location" class="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ alumnus.location }}
                  </p>
                  <p v-if="alumnus.bio" class="text-xs text-gray-400 mt-1.5 line-clamp-2">
                    {{ alumnus.bio }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2 mt-8">
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
const alumni = ref<any[]>([])
const groupedByYear = ref<Record<string, any[]>>({})
const searchQuery = ref('')
const filterGraduationYear = ref('')
const filterLocation = ref('')
const availableYears = ref<number[]>([])
const availableLocations = ref<string[]>([])
const pagination = ref({ page: 1, limit: 24, total: 0, totalPages: 0 })

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const loadAlumni = async (page = 1) => {
  loading.value = true

  try {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', '24')
    if (searchQuery.value) params.set('search', searchQuery.value)
    if (filterGraduationYear.value) params.set('graduationYear', filterGraduationYear.value)
    if (filterLocation.value) params.set('location', filterLocation.value)

    const response = await get(`/api/alumni?${params.toString()}`)
    if (response.success) {
      alumni.value = response.alumni
      groupedByYear.value = response.grouped
      pagination.value = response.pagination
    }
  } catch (error: any) {
    console.error('Load alumni error:', error)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadAlumni()
  }, 300)
}

const resetFilters = () => {
  searchQuery.value = ''
  filterGraduationYear.value = ''
  filterLocation.value = ''
  loadAlumni()
}

const getInitials = (user: any) => {
  const fn = user.fn || ''
  const ln = user.ln || ''
  return (ln[0] || '') + (fn[0] || '') || '?'
}

const goToPage = (page: number) => {
  loadAlumni(page)
}

// Preload available filters
const loadFilters = async () => {
  try {
    // Load all alumni to extract available years and locations
    const response = await get('/api/alumni?limit=1000')
    if (response.success && response.alumni) {
      const years = new Set<number>()
      const locations = new Set<string>()
      response.alumni.forEach((a: any) => {
        if (a.graduationYear) years.add(a.graduationYear)
        if (a.location) locations.add(a.location)
      })
      availableYears.value = Array.from(years).sort((a, b) => b - a)
      availableLocations.value = Array.from(locations).sort()
    }
  } catch (error: any) {
    // Silently fail
  }
}

onMounted(() => {
  loadAlumni()
  loadFilters()
})

useHead({
  title: `校友名录 - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: '查看广州市第二中学加拿大校友名录，按届别和地区查找同窗校友。' },
    { name: 'keywords', content: '广州二中, 校友名录, 加拿大' }
  ]
})
</script>
