<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
    <div class="max-w-md mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-8">校友注册</h1>

        <form @submit.prevent="handleSignup" class="space-y-6">
          <Input
            id="email"
            v-model="form.email"
            label="邮箱地址"
            type="email"
            placeholder="请输入邮箱地址"
            required
          />

          <Input
            id="fn"
            v-model="form.fn"
            label="名"
            placeholder="请输入名"
            required
          />

          <Input
            id="ln"
            v-model="form.ln"
            label="姓"
            placeholder="请输入姓"
            required
          />

          <Input
            id="graduationYear"
            v-model="form.graduationYear"
            label="毕业届别（年份）"
            type="number"
            placeholder="如：2005"
            :min="1950"
            :max="new Date().getFullYear()"
          />

          <Input
            id="location"
            v-model="form.location"
            label="当前所在城市"
            placeholder="如：多伦多、温哥华"
          />

          <PasswordInput
            id="password"
            v-model="form.password"
            label="密码"
            placeholder="请输入密码（至少6位）"
            required
          />

          <PasswordInput
            id="confirmPassword"
            v-model="form.confirmPassword"
            label="确认密码"
            placeholder="请再次输入密码"
            required
          />

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="text-green-600 text-sm text-center">
            {{ successMessage }}
          </div>

          <Button
            type="submit"
            :loading="loading"
            loading-text="注册中..."
          >
            注册
          </Button>
        </form>

        <!-- Login Link -->
        <p class="mt-6 text-center text-gray-600">
          已有账号？
          <LinkButton to="/login" variant="text-primary">
            立即登录
          </LinkButton>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '~/components/form/Input.vue'
import PasswordInput from '~/components/form/PasswordInput.vue'
import Button from '~/components/form/Button.vue'
import LinkButton from '~/components/form/LinkButton.vue'
import { post } from '~/utils/http'
import { SITE_NAME } from '~/constants'

const form = ref({
  fn: '',
  ln: '',
  email: '',
  password: '',
  confirmPassword: '',
  graduationYear: '',
  location: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSignup = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Validate passwords match
    if (form.value.password !== form.value.confirmPassword) {
      errorMessage.value = '两次输入的密码不一致'
      return
    }

    // Call signup API
    await post('/api/auth/signup', {
      fn: form.value.fn,
      ln: form.value.ln,
      email: form.value.email,
      password: form.value.password,
      graduationYear: form.value.graduationYear ? Number(form.value.graduationYear) : undefined,
      location: form.value.location || undefined
    })

    successMessage.value = '注册成功！正在跳转到登录页面...'

    setTimeout(() => {
      navigateTo('/login')
    }, 2000)
  } catch (error: any) {
    errorMessage.value = error.data?.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

useHead({
  title: `校友注册 - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: `注册广州市第二中学加拿大校友网账号，加入校友社区。` },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
