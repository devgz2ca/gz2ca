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
          <NuxtLink
            to="/admin/news"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="route.path === '/admin/news'
              ? 'bg-[#11817b] text-white'
              : 'text-gray-600 hover:bg-gray-100'"
          >
            动态管理
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Admin Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">动态列表</h2>
          <p class="text-sm text-gray-500 mt-1">共 {{ pagination.total }} 条动态</p>
        </div>
        <Button @click="showCreateModal = true">
          <svg class="w-5 h-5 inline-block mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          发布动态
        </Button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#11817b]"></div>
        <p class="mt-2 text-gray-500">加载中...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
        <Button @click="loadNews" variant="secondary" class="mt-2">重试</Button>
      </div>

      <!-- News Table -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布者</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标签</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in news" :key="item._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 max-w-[250px] truncate" :title="item.title">
                  {{ item.title }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.author ? `${item.author.ln || ''}${item.author.fn || ''}` : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in (item.tags || [])"
                    :key="tag"
                    class="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="!item.tags || item.tags.length === 0" class="text-gray-400 text-xs">-</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  ]"
                >
                  {{ item.status === 'published' ? '已发布' : '草稿' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(item.ts) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="deleteNews(item._id)"
                  class="text-red-500 hover:text-red-700 font-medium"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="news.length === 0" class="text-center py-12">
          <p class="text-gray-500">暂无动态</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-6 flex justify-center gap-2">
        <Button
          variant="secondary"
          :disabled="page <= 1"
          @click="page--; loadNews()"
        >
          上一页
        </Button>
        <span class="px-4 py-2 text-sm text-gray-600">
          第 {{ page }} / {{ pagination.totalPages }} 页
        </span>
        <Button
          variant="secondary"
          :disabled="page >= pagination.totalPages"
          @click="page++; loadNews()"
        >
          下一页
        </Button>
      </div>
    </main>

    <!-- Create News Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeModal">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b">
          <h3 class="text-xl font-bold text-gray-900">发布校友动态</h3>
        </div>
        <form @submit.prevent="handleCreate" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
            <input
              v-model="createForm.title"
              type="text"
              required
              placeholder="请输入动态标题"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11817b] focus:border-[#11817b] outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">摘要</label>
            <input
              v-model="createForm.summary"
              type="text"
              placeholder="简短摘要（可选）"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11817b] focus:border-[#11817b] outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">内容 *</label>
            <textarea
              v-model="createForm.content"
              required
              rows="6"
              placeholder="请输入动态内容..."
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11817b] focus:border-[#11817b] outline-none resize-none"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
            <input
              v-model="createForm.tagsInput"
              type="text"
              placeholder="如：聚会, 迎新, 公告"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11817b] focus:border-[#11817b] outline-none"
            />
          </div>
          <div v-if="createError" class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {{ createError }}
          </div>
          <div class="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" @click="closeModal">取消</Button>
            <Button type="submit" :loading="creating">发布</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LinkButton from '~/components/form/LinkButton.vue'
import Button from '~/components/form/Button.vue'
import { get, post, del } from '~/utils/http'
import { useUser } from '~/composables/useAuth'

interface NewsItem {
  _id: string
  title: string
  content: string
  summary?: string
  status: string
  tags: string[]
  author?: { fn?: string; ln?: string }
  ts: string
}

const route = useRoute()
const { user } = useUser()
const news = ref<NewsItem[]>([])
const loading = ref(false)
const error = ref('')
const page = ref(1)
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })
const showCreateModal = ref(false)
const creating = ref(false)
const createError = ref('')
const createForm = ref({
  title: '',
  summary: '',
  content: '',
  tagsInput: ''
})

const loadNews = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await get(`/api/news?page=${page.value}&limit=20`)
    if (response.success) {
      news.value = response.news
      pagination.value = response.pagination
    }
  } catch (err: any) {
    error.value = err.data?.message || '加载动态列表失败'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const closeModal = () => {
  showCreateModal.value = false
  createForm.value = { title: '', summary: '', content: '', tagsInput: '' }
  createError.value = ''
}

const handleCreate = async () => {
  creating.value = true
  createError.value = ''

  try {
    const tags = createForm.value.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    const response = await post('/api/news', {
      title: createForm.value.title,
      content: createForm.value.content,
      summary: createForm.value.summary || undefined,
      tags
    })

    if (response.success) {
      closeModal()
      page.value = 1
      loadNews()
    }
  } catch (err: any) {
    createError.value = err.data?.message || '发布失败'
  } finally {
    creating.value = false
  }
}

const deleteNews = async (id: string) => {
  if (!confirm('确定删除这条动态吗？')) return

  try {
    await del(`/api/news/${id}`)
    loadNews()
  } catch (err: any) {
    error.value = err.data?.message || '删除失败'
  }
}

onMounted(() => {
  if (!user.value || user.value.role !== 'admin') {
    navigateTo('/')
    return
  }
  loadNews()
})
</script>
