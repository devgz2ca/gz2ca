<template>
  <div>
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
          <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#11817b] flex items-center justify-center text-white font-medium">
                  {{ getInitials(user) }}
                </div>
                <div class="text-sm font-medium text-gray-900">
                  {{ user.fn || '' }} {{ user.ln || '' }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.eml }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                ]"
              >
                {{ user.role === 'admin' ? '管理员' : '用户' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.graduationYear || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.location || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.ts) }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from '~/components/form/Button.vue'
import { get } from '~/utils/http'

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

const getInitials = (user: User) => {
  const fn = user.fn?.[0] || ''
  const ln = user.ln?.[0] || ''
  return (fn + ln).toUpperCase() || '?'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadUsers()
})
</script>
