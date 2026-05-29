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
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900">活动列表</h2>
        <p class="text-sm text-gray-500 mt-1">共 {{ pagination.total }} 个活动</p>
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#11817b]"></div>
        <p class="mt-2 text-gray-500">加载中...</p>
      </div>
      
      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
        <Button @click="loadEvents" variant="secondary" class="mt-2">
          重试
        </Button>
      </div>
      
      <!-- Events Table -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布者</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地点</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动日期</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">浏览</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="evt in events" :key="evt._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 max-w-[200px] truncate" :title="evt.tl">
                  {{ evt.tl }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  {{ evt.category || 'event' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ evt.user ? `${evt.user.fn || ''} ${evt.user.ln || ''}`.trim() || evt.user.eml : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    evt.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  ]"
                >
                  {{ evt.status === 'published' ? '已发布' : '草稿' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ evt.place_id?.tl || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(evt.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ evt.views || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(evt.ts) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <NuxtLink
                  :to="`/events/${evt.url}`"
                  target="_blank"
                  class="text-[#11817b] hover:text-[#0d6b67] font-medium"
                >
                  查看
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="events.length === 0" class="text-center py-12">
          <p class="text-gray-500">暂无活动</p>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-6 flex justify-center gap-2">
        <Button
          variant="secondary"
          :disabled="page <= 1"
          @click="page--; loadEvents()"
        >
          上一页
        </Button>
        <span class="px-4 py-2 text-sm text-gray-600">
          第 {{ page }} / {{ pagination.totalPages }} 页
        </span>
        <Button
          variant="secondary"
          :disabled="page >= pagination.totalPages"
          @click="page++; loadEvents()"
        >
          下一页
        </Button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LinkButton from '~/components/form/LinkButton.vue'
import Button from '~/components/form/Button.vue'
import { get } from '~/utils/http'
import { useUser } from '~/composables/useAuth'

interface EventItem {
  _id: string
  tl: string
  category: string
  status: string
  place_id?: { _id: string; tl: string }
  user?: { fn?: string; ln?: string; eml?: string }
  date: string
  views: number
  ts: string
  url: string
}

const route = useRoute()
const { user } = useUser()
const events = ref<EventItem[]>([])
const loading = ref(false)
const error = ref('')
const page = ref(1)
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

const loadEvents = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await get(`/api/admin/events?page=${page.value}`)
    if (response.success) {
      events.value = response.events
      pagination.value = response.pagination
    }
  } catch (err: any) {
    error.value = err.data?.message || '加载活动列表失败'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

onMounted(() => {
  if (!user.value || user.value.role !== 'admin') {
    navigateTo('/')
    return
  }
  loadEvents()
})
</script>
