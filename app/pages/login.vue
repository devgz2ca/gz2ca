<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
    <div class="max-w-md mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-8">登录</h1>
        <LoginForm redirect-on-success :show-signup-link />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'
import { SITE_NAME } from '~/constants'

useHead({
  title: `登录 - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: `登录${SITE_NAME}社区账号。` },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
