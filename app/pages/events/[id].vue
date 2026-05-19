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
                <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-4">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm font-medium">{{ formatDate(event.date) }}</span>
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
import { ref, computed } from 'vue'
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
import { post, del, put } from '~/utils/http'
import { useUser } from '~/composables/useAuth'
import { SITE_NAME } from '~/constants'
import { formatDate } from '~/utils/date'

const route = useRoute()
const { user: currentUser } = useUser()

const { data: eventData, pending: loading, error: fetchError, refresh } = await useFetch(`/api/events/${route.params.id}`, {
  key: `event-${route.params.id}`
})

const event = computed(() => eventData.value?.event || null)
const organizer = computed(() => eventData.value?.organizer || null)
const media = computed(()=>eventData.value?.medias || []);
const mediaLoading = ref(false)
const showEditModal = ref(false)

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

const loadMedia = async () => {
  if (!event?.value?._id) return
  mediaLoading.value = true

  try {
    const response = await useFetch(`/api/events/${event.value?._id}/media`)
    if (response.data.value?.success) {
      media.value = response.data.value.media
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
