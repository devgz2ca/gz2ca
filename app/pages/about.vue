<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-[#1a5276] to-[#11817b] text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">关于母校</h1>
        <p class="text-lg text-white/80">广州市第二中学 · 品质教育 · 百年传承</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- School Overview -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-8 bg-[#11817b] rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900">学校简介</h2>
        </div>

        <div class="prose prose-gray max-w-none">
          <p class="text-gray-700 leading-relaxed mb-4">
            广州市第二中学创建于1930年，前身为学海堂、菊坡精舍、应元书院等书院，历史悠久，文化底蕴深厚。
            学校是广东省重点中学、广东省一级学校、广东省国家级示范性普通高中。
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            二中秉承"立志成才，振兴中华"的校训，坚持"以学生发展为本"的办学理念，
            致力于培养具有家国情怀、国际视野的优秀人才。学校师资力量雄厚，教学质量优异，
            高考成绩和学科竞赛成绩长期位居广州市前列。
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            学校现有应元路校区（高中部）、苏元山校区（初中部）和开元学校等多个校区。
            校园环境优美，教学设施先进，是莘莘学子求学成才的理想之地。
          </p>

          <!-- School Info Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 not-prose">
            <div class="bg-gradient-to-br from-[#11817b]/5 to-[#1a5276]/5 rounded-xl p-5 text-center">
              <div class="text-3xl font-bold text-[#11817b]">1930</div>
              <div class="text-sm text-gray-600 mt-1">建校年份</div>
            </div>
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 text-center">
              <div class="text-3xl font-bold text-amber-600">省重点</div>
              <div class="text-sm text-gray-600 mt-1">学校级别</div>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 text-center">
              <div class="text-3xl font-bold text-blue-600">多校区</div>
              <div class="text-sm text-gray-600 mt-1">办学规模</div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 text-center">
              <div class="text-3xl font-bold text-green-600">90+</div>
              <div class="text-sm text-gray-600 mt-1">办学历史(年)</div>
            </div>
          </div>
        </div>
      </div>

      <!-- School Motto -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-8 bg-[#11817b] rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900">校训与精神</h2>
        </div>

        <div class="bg-gradient-to-r from-[#11817b]/5 to-[#1a5276]/5 rounded-xl p-8 text-center mb-6">
          <p class="text-3xl font-bold text-[#11817b] tracking-widest">立志成才 振兴中华</p>
          <p class="text-gray-500 mt-2">—— 广州市第二中学校训</p>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-xl p-5 text-center">
            <h3 class="font-semibold text-gray-900 mb-2">校风</h3>
            <p class="text-gray-600">严 勤 实 活</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-5 text-center">
            <h3 class="font-semibold text-gray-900 mb-2">教风</h3>
            <p class="text-gray-600">敬业 爱生 严谨 创新</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-5 text-center">
            <h3 class="font-semibold text-gray-900 mb-2">学风</h3>
            <p class="text-gray-600">尊师 勤学 善思 进取</p>
          </div>
        </div>
      </div>

      <!-- Canada Alumni -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-8 bg-[#11817b] rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900">加拿大校友会</h2>
        </div>

        <div class="prose prose-gray max-w-none">
          <p class="text-gray-700 leading-relaxed mb-4">
            广州市第二中学加拿大校友会致力于联络和服务在加校友，搭建校友之间的沟通桥梁，
            组织各类校友活动，传承二中精神，促进校友之间的互助与合作。
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            无论您是初到加拿大的新校友，还是在加拿大生活多年的老校友，
            加拿大校友会都欢迎您的加入！我们定期组织聚会、讲座、户外活动等，
            让远在异国他乡的二中人也能感受到家的温暖。
          </p>
          <div class="not-prose mt-6">
            <NuxtLink
              to="/signup"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[#11817b] text-white rounded-xl hover:bg-[#0d6b64] transition-colors font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              加入校友会
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SITE_NAME } from '~/constants'

useHead({
  title: `关于母校 - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: '广州市第二中学简介，创建于1930年，广东省重点中学。了解广州二中的历史、校训、办学理念。' },
    { name: 'keywords', content: '广州二中, 广州市第二中学, 学校简介, 校训' }
  ]
})
</script>
