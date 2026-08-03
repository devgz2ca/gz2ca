<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-[#1a5276] via-[#1a6d5e] to-[#11817b] text-white relative overflow-hidden">
      <!-- Decorative Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white/30"></div>
        <div class="absolute bottom-20 right-20 w-48 h-48 rounded-full border-4 border-white/20"></div>
        <div class="absolute top-1/2 left-1/3 w-24 h-24 rounded-full border-4 border-white/25"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        <!-- Logo Badge -->
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
          <span class="text-3xl font-bold">二中</span>
        </div>

        <h1 class="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{{ SITE_NAME }}</h1>
        <p class="text-xl text-white/90 max-w-2xl mx-auto mb-4">
          广州市第二中学加拿大校友之家
        </p>
        <p class="text-lg text-white/80 max-w-2xl mx-auto mb-8">
          联络校友情谊 · 传承二中精神 · 互助共享共进
        </p>

        <!-- Quick Stats -->
        <div class="flex flex-wrap justify-center gap-8 mt-12">
          <div class="text-center">
            <div class="text-4xl font-bold">{{ alumniCount }}</div>
            <div class="text-white/70 text-sm mt-1">注册校友</div>
          </div>
          <div class="w-px bg-white/20 hidden sm:block"></div>
          <div class="text-center">
            <div class="text-4xl font-bold">{{ events.length || 0 }}</div>
            <div class="text-white/70 text-sm mt-1">校友活动</div>
          </div>
          <div class="w-px bg-white/20 hidden sm:block"></div>
          <div class="text-center">
            <div class="text-4xl font-bold">{{ upcomingCount }}</div>
            <div class="text-white/70 text-sm mt-1">即将举行</div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap justify-center gap-4 mt-10">
          <Button v-if="!isLoggedIn" @click="navigateTo('/signup')" variant="secondary" :full-width="false"
            customClass="!bg-white !text-[#11817b] hover:!bg-gray-100 !font-semibold !px-8 !py-3 rounded-xl">
            校友注册
          </Button>
          <Button v-if="isLoggedIn" @click="showCreateModal = true" variant="secondary" :full-width="false"
            customClass="!bg-white !text-[#11817b] hover:!bg-gray-100 !font-semibold !px-8 !py-3 rounded-xl">
            <svg class="w-5 h-5 inline-block mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            发布活动
          </Button>
          <Button @click="scrollToEvents" variant="secondary" :full-width="false"
            customClass="!bg-transparent !text-white !border-2 !border-white/50 hover:!bg-white/10 !font-medium !px-8 !py-3 rounded-xl">
            浏览活动
          </Button>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid md:grid-cols-4 gap-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div class="w-14 h-14 bg-[#11817b]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-[#11817b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">校友联络</h3>
          <p class="text-gray-600 text-sm leading-relaxed">链接旅加各届校友，重拾同窗情谊</p>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div class="w-14 h-14 bg-[#b78026]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-[#b78026]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">校友活动</h3>
          <p class="text-gray-600 text-sm leading-relaxed">组织多样校友聚会，共度美好时光</p>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div class="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">互助共享</h3>
          <p class="text-gray-600 text-sm leading-relaxed">分享经验资源，携手互帮互助</p>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div class="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">母校情怀</h3>
          <p class="text-gray-600 text-sm leading-relaxed">传承二中精神，心系母校发展</p>
        </div>
      </div>
    </div>

    <!-- Events Section -->
    <div ref="eventsSection" class="bg-white border-t">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Section Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">校友活动</h2>
            <p class="text-gray-500 mt-1">查看即将举行的校友聚会活动</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button v-for="filter in filters" :key="filter.value"
              @click="filterView = filter.value"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filterView === filter.value
                  ? 'bg-[#11817b] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]">
              {{ filter.tl }}
            </button>
          </div>
        </div>

        <EventList :events="displayedEvents" :loading="loading" :error-message="errorMessage" empty-message="暂无活动"
          :columns="3">
          <template v-if="errorMessage" #error-actions>
            <Button @click="loadEvents" variant="primary" class="mt-4" :full-width="false">
              <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </Button>
          </template>
        </EventList>
      </div>
    </div>

    <EventModal :is-open="showCreateModal" @close="showCreateModal = false" @submit="handleCreateEvent" />
  </div>

</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import Button from '~/components/form/Button.vue'
import EventList from '~/components/event/EventList.vue'
import EventModal from '~/components/event/EventModal.vue'
import { get, post } from '~/utils/http'
import { useUser } from '~/composables/useAuth'
import { SITE_NAME } from '~/constants'

const router = useRouter()
const { isLoggedIn } = useUser()

const loading = ref(true)
const errorMessage = ref('')
const events = ref<any[]>([])
const showCreateModal = ref(false)
const filterView = ref<string>('all')
const eventsSection = ref<HTMLElement | null>(null)
const alumniCount = ref(0)

const filters = [
  { tl: '全部', value: 'all' },
  { tl: '即将举行', value: 'upcoming' },
  { tl: '往期活动', value: 'past' }
]

const upcomingCount = computed(() => {
  const now = new Date()
  return events.value.filter(event => new Date(event.date) >= now).length
})

const displayedEvents = computed(() => {
  const now = new Date()

  switch (filterView.value) {
    case 'upcoming':
      return events.value.filter(event => new Date(event.date) >= now)
    case 'past':
      return events.value.filter(event => new Date(event.date) < now)
    default:
      return events.value
  }
})

const loadEvents = async () => {
  loading.value = true
  errorMessage.value = ''

  const maxRetries = 3
  let attempt = 0
  let loaded = false

  while (attempt < maxRetries && !loaded) {
    attempt += 1

    try {
      const response = await get('/api/events')
      if (response.success) {
        events.value = response.events
      }
      loaded = true
    } catch (error: any) {
      if (attempt >= maxRetries) {
        errorMessage.value = '加载活动失败'
      } else {
        loadEvents(); // Retry
      }
    }
  }

  loading.value = false
}

// Load alumni count
const loadAlumniCount = async () => {
  try {
    const response = await get('/api/alumni/count')
    if (response.success) {
      alumniCount.value = response.count
    }
  } catch (error: any) {
    // Silently fail for count
  }
}

const handleCreateEvent = async (eventId: string | null, data: any) => {
  try {
    const response = await post('/api/events', data)

    if (response.success && response.event) {
      showCreateModal.value = false
      router.push(`/events/${response.event._id}`)
    }
  } catch (error: any) {
    throw error
  }
}

const scrollToEvents = () => {
  eventsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  loadEvents()
  loadAlumniCount()
})

useHead({
  title: `${SITE_NAME} - 广州市第二中学加拿大校友之家`,
  meta: [
    { name: 'description', content: '广州市第二中学加拿大校友网，联络旅加校友，传承二中精神。查看校友活动、校友名录、校友动态。' },
    { name: 'keywords', content: '广州二中, 加拿大校友, 广州市第二中学, 校友会, 加拿大' },
    { property: 'og:title', content: `${SITE_NAME} - 广州市第二中学加拿大校友之家` },
    { property: 'og:description', content: '广州市第二中学加拿大校友网，联络旅加校友，传承二中精神。' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>
