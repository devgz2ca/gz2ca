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
        </nav>
      </div>
    </header>
    
    <!-- Admin Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900">用户列表</h2>
        <p class="text-sm text-gray-500 mt-1">共 {{ pagination.total }} 位用户</p>
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#11817b]"></div>
        <p class="mt-2 text-gray-500">加载中...</p>
      </div>
      
      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
        <Button @click="loadUsers" variant="secondary" class="mt-2">
          重试
        </Button>
      </div>
      
      <!-- Users Table -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">毕业年份</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所在地</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="u in users" :key="u._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#11817b] flex items-center justify-center text-white font-medium">
                    {{ getInitials(u) }}
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ u.fn || '' }} {{ u.ln || '' }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ u.eml }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ u.role === 'admin' ? '管理员' : '用户' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ u.graduationYear || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ u.location || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(u.ts) }}
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="users.length === 0" class="text-center py-12">
          <p class="text-gray-500">暂无用户</p>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-6 flex justify-center gap-2">
        <Button
          variant="secondary"
          :disabled="page <= 1"
          @click="page--; loadUsers()"
        >
          上一页
        </Button>
        <span class="px-4 py-2 text-sm text-gray-600">
          第 {{ page }} / {{ pagination.totalPages }} 页
        </span>
        <Button
          variant="secondary"
          :disabled="page >= pagination.totalPages"
          @click="page++; loadUsers()"
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

interface User {
  _id: string
  fn: string
  ln: string
  eml: string
  role: string
  graduationYear?: number
  location?: string
  ts: string
}

const route = useRoute()
const { user } = useUser()
const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const page = ref(1)
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

const loadUsers = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await get(`/api/admin/users?page=${page.value}`)
    if (response.success) {
      users.value = response.users
      pagination.value = response.pagination
    }
  } catch (err: any) {
    error.value = err.data?.message || '加载用户列表失败'
  } finally {
    loading.value = false
  }
}

const getInitials = (u: User) => {
  const fn = u.fn?.[0] || ''
  const ln = u.ln?.[0] || ''
  return (fn + ln).toUpperCase() || '?'
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
  loadUsers()
})
</script>
