<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
    <div class="p-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#11817b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        评论 ({{ pagination.total }})
      </h2>

      <!-- Comment Form -->
      <div v-if="isLoggedIn" class="mb-8">
        <div class="flex gap-3">
          <div class="w-10 h-10 rounded-full bg-[#11817b] flex-shrink-0 flex items-center justify-center text-white font-medium text-sm">
            {{ userInitials }}
          </div>
          <div class="flex-1">
            <textarea
              v-model="commentContent"
              rows="3"
              class="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#11817b] focus:border-transparent resize-none"
              placeholder="写下你的评论..."
              :disabled="commentSubmitting"
            ></textarea>
            <div class="flex justify-end mt-2">
              <Button
                type="button"
                variant="primary"
                :full-width="false"
                custom-class="!px-4 !py-1.5 !text-sm"
                :disabled="!commentContent.trim() || commentSubmitting"
                @click="handleSubmitComment"
              >
                {{ commentSubmitting ? '发表中...' : '发表评论' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mb-8 p-4 bg-gray-50 rounded-lg text-center">
        <p class="text-sm text-gray-500">
          <NuxtLink to="/login" class="text-[#11817b] hover:underline font-medium">登录</NuxtLink>
          后即可发表评论
        </p>
      </div>

      <!-- Comments List -->
      <div v-if="commentsLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#11817b]"></div>
        <p class="mt-2 text-sm text-gray-500">加载评论中...</p>
      </div>
      <div v-else-if="commentsError" class="text-center py-4">
        <p class="text-sm text-red-500">{{ commentsError }}</p>
        <Button type="button" variant="secondary" :full-width="false" class="mt-2" @click="loadComments">重试</Button>
      </div>
      <div v-else-if="comments.length === 0" class="text-center py-8">
        <p class="text-sm text-gray-500">暂无评论，来说两句吧</p>
      </div>
      <div v-else class="space-y-6">
        <div v-for="comment in comments" :key="comment._id" class="flex gap-3 group">
          <div
            class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium text-sm"
            :class="comment.user?.avt ? '' : 'bg-[#11817b]'"
          >
            <img v-if="comment.user?.avt" :src="comment.user.avt" class="w-10 h-10 rounded-full object-cover" />
            <span v-else>{{ getCommentUserInitials(comment) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-medium text-gray-900">
                {{ comment.user?.fn || '' }} {{ comment.user?.ln || '' }}
              </span>
              <span class="text-xs text-gray-400">{{ formatTime(comment.ts) }}</span>
            </div>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>
          </div>
          <div v-if="canDeleteComment(comment)" class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="handleDeleteComment(comment)"
              class="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="删除"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="page < pagination.totalPages" class="mt-6 text-center">
        <Button type="button" variant="secondary" :full-width="false" :disabled="commentsLoading" @click="page++; loadComments()">
          加载更多
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '~/components/form/Button.vue'
import { get, post, del } from '~/utils/http'
import { useUser } from '~/composables/useAuth'

const props = defineProps<{
  eventId: string
}>()

const { user: currentUser, isLoggedIn } = useUser()

const comments = ref<any[]>([])
const commentsLoading = ref(false)
const commentsError = ref('')
const commentContent = ref('')
const commentSubmitting = ref(false)
const page = ref(1)
const pagination = ref({ total: 0, totalPages: 0 } as any)

const userInitials = computed(() => {
  const fn = currentUser.value?.fn?.[0] || ''
  const ln = currentUser.value?.ln?.[0] || ''
  return (fn + ln).toUpperCase() || '?'
})

const loadComments = async () => {
  commentsLoading.value = true
  commentsError.value = ''

  try {
    const response = await get(`/api/events/${props.eventId}/comments?page=${page.value}`)
    if (response.success) {
      if (page.value === 1) {
        comments.value = response.comments
      } else {
        comments.value = [...comments.value, ...response.comments]
      }
      pagination.value = response.pagination
    }
  } catch (err: any) {
    commentsError.value = err.data?.message || '加载评论失败'
  } finally {
    commentsLoading.value = false
  }
}

const handleSubmitComment = async () => {
  if (!commentContent.value.trim() || commentSubmitting.value) return
  commentSubmitting.value = true

  try {
    await post('/api/comments', {
      eventId: props.eventId,
      content: commentContent.value.trim()
    })
    commentContent.value = ''
    page.value = 1
    await loadComments()
  } catch (err: any) {
    alert(err.data?.message || '发表评论失败')
  } finally {
    commentSubmitting.value = false
  }
}

const canDeleteComment = (comment: any) => {
  const userId = currentUser.value?._id
  return userId === comment.user_id || currentUser.value?.role === 'admin'
}

const handleDeleteComment = async (comment: any) => {
  if (!confirm('确定要删除这条评论吗？')) return
  try {
    await del(`/api/comments/${comment._id}`)
    page.value = 1
    await loadComments()
  } catch (err: any) {
    alert(err.data?.message || '删除评论失败')
  }
}

const getCommentUserInitials = (comment: any) => {
  const fn = comment.user?.fn?.[0] || ''
  const ln = comment.user?.ln?.[0] || ''
  return (fn + ln).toUpperCase() || '?'
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

defineExpose({ loadComments })

// Auto-load on mount
loadComments()
</script>
