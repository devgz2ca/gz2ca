<template>
  <footer class="bg-gray-900 text-gray-300 border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-white font-semibold mb-4">广州市第二中学加拿大校友网</h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            广州市第二中学（简称"广州二中"）创建于1930年，是广东省重点中学、广东省一级学校。加拿大校友网旨在联络旅加校友，传承二中精神，互助共进。
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">快速链接</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors">首页</NuxtLink></li>
            <li><NuxtLink to="/alumni" class="text-gray-400 hover:text-white transition-colors">校友名录</NuxtLink></li>
            <li><NuxtLink to="/events" class="text-gray-400 hover:text-white transition-colors">校友活动</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact & Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">关于我们</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/about" class="text-gray-400 hover:text-white transition-colors">关于母校</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white transition-colors">联系我们</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-10 pt-6">
        <p class="text-sm text-gray-400 text-center">
          &copy; {{ currentYear }} {{ SITE_NAME }}. 版权所有.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SITE_NAME } from '~/constants'

const currentYear = new Date().getFullYear()
</script>
