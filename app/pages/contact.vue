<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-[#1a5276] to-[#11817b] text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">联系我们</h1>
        <p class="text-lg text-white/80">欢迎联系广州市第二中学加拿大校友会</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Contact Info -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-1.5 h-8 bg-[#11817b] rounded-full"></div>
            <h2 class="text-xl font-bold text-gray-900">联系方式</h2>
          </div>

          <div class="space-y-6">
            <!-- Email -->
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-[#11817b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-[#11817b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">电子邮箱</h3>
                <p class="text-gray-600 mt-1">gz2alumni@example.com</p>
              </div>
            </div>

            <!-- WeChat -->
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">微信公众号</h3>
                <p class="text-gray-600 mt-1">广州二中加拿大校友会</p>
              </div>
            </div>

            <!-- Regions -->
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">主要城市联络人</h3>
                <div class="text-gray-600 mt-1 space-y-1">
                  <p>多伦多地区</p>
                  <p>温哥华地区</p>
                  <p>蒙特利尔地区</p>
                  <p>卡尔加里地区</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Join / Message -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-1.5 h-8 bg-[#11817b] rounded-full"></div>
            <h2 class="text-xl font-bold text-gray-900">加入我们</h2>
          </div>

          <p class="text-gray-600 leading-relaxed mb-6">
            广州市第二中学加拿大校友会欢迎所有在加拿大的校友加入。
            注册校友账号即可查看校友名录、参与校友活动、获取最新动态。
          </p>

          <div class="space-y-4">
            <NuxtLink
              to="/signup"
              class="block w-full text-center py-3 bg-[#11817b] text-white rounded-xl hover:bg-[#0d6b64] transition-colors font-medium"
            >
              校友注册
            </NuxtLink>
            <NuxtLink
              to="/alumni"
              class="block w-full text-center py-3 border-2 border-[#11817b] text-[#11817b] rounded-xl hover:bg-[#11817b]/5 transition-colors font-medium"
            >
              查看校友名录
            </NuxtLink>
            <NuxtLink
              to="/events"
              class="block w-full text-center py-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              浏览校友活动
            </NuxtLink>
          </div>

          <!-- Simple message form -->
          <div class="mt-8 pt-6 border-t border-gray-100">
            <h3 class="font-semibold text-gray-900 mb-4">发送留言</h3>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <input
                v-model="form.name"
                type="text"
                placeholder="您的姓名"
                required
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11817b] focus:border-[#11817b] outline-none"
              />
              <input
                v-model="form.email"
                type="email"
                placeholder="您的邮箱"
                required
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11817b] focus:border-[#11817b] outline-none"
              />
              <textarea
                v-model="form.message"
                placeholder="请输入您的留言或问题..."
                rows="4"
                required
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11817b] focus:border-[#11817b] outline-none resize-none"
              ></textarea>
              <button
                type="submit"
                :disabled="submitted"
                :class="[
                  'w-full py-3 rounded-xl font-medium transition-colors',
                  submitted
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-[#11817b] text-white hover:bg-[#0d6b64]'
                ]"
              >
                {{ submitted ? '留言已提交' : '发送留言' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SITE_NAME } from '~/constants'

const submitted = ref(false)
const form = ref({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = () => {
  // Simple demo submission
  submitted.value = true
  form.value = { name: '', email: '', message: '' }
  setTimeout(() => {
    submitted.value = false
  }, 5000)
}

useHead({
  title: `联系我们 - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: '联系广州市第二中学加拿大校友会，加入校友社区。' },
    { name: 'keywords', content: '广州二中, 校友会, 联系方式, 加拿大' }
  ]
})
</script>
