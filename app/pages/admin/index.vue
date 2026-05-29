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
        <h2 class="text-xl font-semibold text-gray-900">欢迎来到管理后台</h2>
        <p class="text-sm text-gray-500 mt-1">选择左侧菜单开始管理</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import LinkButton from '~/components/form/LinkButton.vue'
import { useUser } from '~/composables/useAuth'

const route = useRoute()
const { user } = useUser()

onMounted(() => {
  if (!user.value || user.value.role !== 'admin') {
    navigateTo('/')
  }
})
</script>
