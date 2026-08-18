<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">管理后台</h1>
          <LinkButton to="/" variant="secondary">
            返回首页
          </LinkButton>
        </div>
        
        <!-- Admin Navigation -->
        <nav class="mt-4 flex gap-4">
          <NuxtLink
            to="/admin"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="route.path === '/admin' 
              ? 'bg-[#11817b] text-white' 
              : 'text-gray-600 hover:bg-gray-100'"
          >
            概览
          </NuxtLink>
          <NuxtLink
            to="/admin/users"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="route.path === '/admin/users' 
              ? 'bg-[#11817b] text-white' 
              : 'text-gray-600 hover:bg-gray-100'"
          >
            用户管理
          </NuxtLink>
          <NuxtLink
            to="/admin/events"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="route.path === '/admin/events' 
              ? 'bg-[#11817b] text-white' 
              : 'text-gray-600 hover:bg-gray-100'"
          >
            活动管理
          </NuxtLink>
        </nav>
      </div>
    </header>
    
    <!-- Admin Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900">概览</h2>
        <p class="text-sm text-gray-500 mt-1">管理网站内容与用户</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#11817b]"></div>
        <p class="mt-2 text-gray-500">加载中...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
      </div>

      <!-- Stats Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Pending Approvals -->
        <NuxtLink
          to="/admin/events?filter=pending"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs text-gray-400 group-hover:text-[#11817b] transition-colors">查看详情 →</span>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">{{ pendingCount }}</div>
          <div class="text-sm text-gray-600">待审核活动</div>
          <p class="text-xs text-gray-400 mt-2">需要您审核通过后公开展示</p>
        </NuxtLink>

        <!-- Total Events -->
        <NuxtLink
          to="/admin/events"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-xs text-gray-400 group-hover:text-[#11817b] transition-colors">管理 →</span>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">{{ totalEvents }}</div>
          <div class="text-sm text-gray-600">全部活动</div>
        </NuxtLink>

        <!-- Total Users -->
        <NuxtLink
          to="/admin/users"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span class="text-xs text-gray-400 group-hover:text-[#11817b] transition-colors">管理 →</span>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">{{ totalUsers }}</div>
          <div class="text-sm text-gray-600">注册校友</div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LinkButton from '~/components/form/LinkButton.vue'
import { get } from '~/utils/http'
import { useUser } from '~/composables/useAuth'

const route = useRoute()
const { user } = useUser()

const loading = ref(true)
const error = ref('')
const pendingCount = ref(0)
const totalEvents = ref(0)
const totalUsers = ref(0)

const loadStats = async () => {
  loading.value = true
  error.value = ''

  try {
    const [eventsRes, usersRes] = await Promise.all([
      get('/api/admin/events?limit=1'),
      get('/api/admin/users?limit=1')
    ])
    if (eventsRes.success) {
      pendingCount.value = eventsRes.pendingCount || 0
      totalEvents.value = eventsRes.pagination?.total || 0
    }
    if (usersRes.success) {
      totalUsers.value = usersRes.pagination?.total || 0
    }
  } catch (err: any) {
    error.value = err.data?.message || '加载统计数据失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!user.value || user.value.role !== 'admin') {
    navigateTo('/')
    return
  }
  loadStats()
})
</script>
