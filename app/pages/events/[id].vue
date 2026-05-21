<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <EventDetailLoading v-if="loading" />

      <!-- Error State -->
      <EventDetailError v-else-if="errorMessage" :message="errorMessage" />

      <!-- Event Detail -->
      <div v-else-if="event">
        <!-- Back Button -->
        <EventDetailBackButton />

        <!-- Event Header Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <!-- Event Cover Area -->
          <div class="bg-gradient-to-br from-[#11817b] to-[#0d6b64] px-8 py-10 text-white">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div class="flex-1">
                <!-- Event Date Badge -->
                <div class="flex items-center gap-3 mb-4 flex-wrap">
                  <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm font-medium">{{ formatDate(event.date) }}</span>
                  </div>
                  <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span class="text-sm font-medium">{{ event.views || 0 }} 次浏览</span>
                  </div>
                </div>

                <h1 class="text-3xl md:text-4xl font-bold mb-3">{{ event.tl }}</h1>

                <!-- Location -->
                <div v-if="event.place_id" class="flex items-center gap-2 text-white/90">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ event.place_id.full_address || event.place_id.name }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="isOwner" class="flex gap-3">
                <Button @click="handleEdit" variant="secondary" :full-width="false"
                  customClass="!bg-white !text-[#11817b] hover:!bg-gray-100 !px-5 !py-2.5 rounded-lg !font-medium">
                  <svg class="w-4 h-4 inline-block mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  编辑活动
                </Button>
              </div>
            </div>
          </div>

          <!-- Event Body -->
          <div class="p-8">
            <!-- Description -->
            <EventDetailDescription :event="event" />

            <!-- Event Info Grid -->
            <div class="mt-8 p-6 bg-gray-50 rounded-xl">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-[#11817b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                活动信息
              </h2>
              <EventInfo :event="event" />
            </div>

            <!-- Organizer Card -->
            <div class="mt-8 p-6 bg-gradient-to-br from-[#11817b]/5 to-transparent rounded-xl border border-[#11817b]/10">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-[#11817b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                组织者
              </h2>
              <EventOrganizer :organizer="organizer" />
            </div>

            <!-- Image Upload (for owner) -->
            <EventDetailMedia v-if="isOwner" @upload="handleImageUpload" class="mt-8" />
          </div>
        </div>

        <!-- Image Gallery -->
        <EventDetailGallery v-if="media.length > 0" :media="media" :can-delete="isOwner" @delete="handleDeleteImage" />

        <!-- Comments Section -->
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
      </div>
    </div>

    <!-- Edit Event Modal -->
    <EventModal
      v-if="isOwner"
      :is-open="showEditModal"
      :event-data="event"
      @close="showEditModal = false"
      @submit="handleUpdateEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Button from '~/components/form/Button.vue'
import EventInfo from '~/components/event/EventInfo.vue'
import EventOrganizer from '~/components/event/EventOrganizer.vue'
import EventModal from '~/components/event/EventModal.vue'
import EventDetailLoading from '~/components/event/EventDetailLoading.vue'
import EventDetailError from '~/components/event/EventDetailError.vue'
import EventDetailDescription from '~/components/event/EventDetailDescription.vue'
import EventDetailMedia from '~/components/event/EventDetailMedia.vue'
import EventDetailGallery from '~/components/event/EventDetailGallery.vue'
import EventDetailBackButton from '~/components/event/EventDetailBackButton.vue'
import { get, post, del, put } from '~/utils/http'
import { useUser } from '~/composables/useAuth'
import { SITE_NAME } from '~/constants'
import { formatDate } from '~/utils/date'

const route = useRoute()
const { user: currentUser, isLoggedIn } = useUser()

const { data: eventData, pending: loading, error: fetchError, refresh } = await useFetch(`/api/events/${route.params.id}`, {
  key: `event-${route.params.id}`
})

const event = computed(() => eventData.value?.event || null)
const organizer = computed(() => eventData.value?.organizer || null)
const media = ref<any[]>([])
const mediaLoading = ref(false)
const showEditModal = ref(false)

// Sync media from eventData when it changes
watch(() => eventData.value?.medias, (newMedias) => {
  media.value = newMedias || []
}, { immediate: true })

const errorMessage = computed(() => {
  if (fetchError.value) {
    return (fetchError.value as any).data?.message || '加载活动失败'
  }
  if (eventData.value && !eventData.value.success) {
    return eventData.value.message || '加载活动失败'
  }
  return ''
})

const isOwner = computed(() => {
  return currentUser.value && event.value && currentUser.value._id === event.value.user_id
})

// Comments
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
  if (!event.value?._id) return
  commentsLoading.value = true
  commentsError.value = ''

  try {
    const response = await get(`/api/events/${event.value._id}/comments?page=${page.value}`)
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
      eventId: event.value._id,
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

// Load comments when event is available
onMounted(()=>{
  loadComments()
})

const loadMedia = async () => {
  if (!event.value?._id) return
  mediaLoading.value = true

  try {
    const response = await get(`/api/events/${event.value._id}/media`)
    if (response.success) {
      media.value = response.media
    }
  } catch (error: any) {
    console.error('Failed to load media:', error)
  } finally {
    mediaLoading.value = false
  }
}

const handleEdit = () => {
  showEditModal.value = true
}

const handleUpdateEvent = async (eventId: string | null, data: any) => {
  try {
    await put(`/api/events/${event.value._id}`, data)
    showEditModal.value = false
    refresh()
  } catch (error: any) {
    throw error
  }
}

const handleImageUpload = async (files: File[]) => {
  try {
    const base64Files = await Promise.all(
      files.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              base64: (reader.result as string).split(',')[1]
            })
          }
          reader.readAsDataURL(file)
        })
      })
    )

    await post('/api/media/upload', {
      eventId: event.value._id,
      files: base64Files
    })

    loadMedia()
  } catch (error: any) {
    console.error('Upload failed:', error)
    alert('上传失败: ' + (error.data?.message || error.message || '未知错误'))
  }
}

const handleDeleteImage = async (item: any) => {
  try {
    await del(`/api/media/${item._id}`)
    loadMedia()
  } catch (error: any) {
    console.error('Delete failed:', error)
    alert('删除失败: ' + (error.data?.message || error.message || '未知错误'))
  }
}

const eventTitle = computed(() => event.value?.tl || '活动详情')

useHead({
  title: computed(() => `${eventTitle.value} - ${SITE_NAME}`),
  link: computed(() => event.value?.url ? [
    { rel: 'canonical', href: event.value.url }
  ] : []),
  meta: computed(() => [
    { name: 'description', content: event.value?.desc || '查看此活动的详细信息' },
    { name: 'keywords', content: `${SITE_NAME}, 活动, ${event.value?.tl || ''}` },
    { property: 'og:title', content: eventTitle.value },
    { property: 'og:description', content: event.value?.desc || '查看此活动的详细信息' },
    { property: 'og:url', content: event.value?.url || '' },
    { property: 'og:type', content: 'website' }
  ])
})
</script>
