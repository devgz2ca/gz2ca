<template>
  <div class="space-y-6">
    <!-- Login Mode Tabs -->
    <div class="flex border-b border-gray-200 mb-6">
      <button
        type="button"
        @click="loginMode = 'password'"
        :class="[
          'flex-1 py-2 text-sm font-medium transition-colors',
          loginMode === 'password'
            ? 'text-[#11817b] border-b-2 border-[#11817b]'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        密码登录
      </button>
      <button
        type="button"
        @click="loginMode = 'code'"
        :class="[
          'flex-1 py-2 text-sm font-medium transition-colors',
          loginMode === 'code'
            ? 'text-[#11817b] border-b-2 border-[#11817b]'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        验证码登录
      </button>
    </div>

    <!-- Password Login Form -->
    <form v-if="loginMode === 'password'" @submit.prevent="handleLogin" class="space-y-6">
      <Input
        id="email"
        v-model="form.email"
        label="邮箱地址"
        type="email"
        placeholder="请输入邮箱地址"
        required
      />

      <PasswordInput
        id="password"
        v-model="form.password"
        label="密码"
        placeholder="请输入密码"
        required
      />

      <!-- Error Message -->
      <div v-if="errorMessage" class="text-red-600 text-sm text-center">
        {{ errorMessage }}
      </div>

      <Button
        type="submit"
        :loading="loading"
        loading-text="登录中..."
      >
        登录
      </Button>
    </form>

    <!-- Code Login Form -->
    <form v-else @submit.prevent="handleCodeLogin" class="space-y-6">
      <Input
        id="codeEmail"
        v-model="codeForm.email"
        label="邮箱地址"
        type="email"
        placeholder="请输入邮箱地址"
        required
      />

      <div class="grid grid-cols-2 gap-2">
        <Input
          id="code"
          v-model="codeForm.code"
          label="验证码"
          placeholder="请输入6位验证码"
          required
          class="flex-1"
        />
        <Button
          type="button"
          @click="sendCode"
          :loading="codeSending"
          :disabled="codeCountdown > 0"
          variant="secondary"
          class="mt-6"
        >
          {{ codeCountdown > 0 ? `${codeCountdown}s` : '发送验证码' }}
        </Button>
      </div>

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
        loading-text="登录中..."
      >
        登录
      </Button>
    </form>

    <!-- Google Login Divider -->
    <div class="my-6 flex items-center">
      <div class="flex-1 border-t border-gray-300"></div>
      <span class="px-4 text-sm text-gray-500">或</span>
      <div class="flex-1 border-t border-gray-300"></div>
    </div>

    <!-- Google Login Button -->
    <button
      type="button"
      @click="handleGoogleLogin"
      :disabled="googleLoading"
      class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span class="text-gray-700 font-medium">{{ googleLoading ? '登录中...' : '使用 Google 登录' }}</span>
    </button>

    <!-- Signup Link -->
    <p v-if="showSignupLink" class="mt-6 text-center text-gray-600">
      还没有账号？
      <LinkButton to="/signup" variant="text-primary">
        立即注册
      </LinkButton>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '~/components/form/Input.vue'
import PasswordInput from '~/components/form/PasswordInput.vue'
import Button from '~/components/form/Button.vue'
import LinkButton from '~/components/form/LinkButton.vue'
import { post } from '~/utils/http'
import { initAuth } from '~/composables/useAuth'

const props = withDefaults(defineProps<{
  redirectOnSuccess?: boolean
  showSignupLink?: boolean
}>(), {
  redirectOnSuccess: false,
  showSignupLink: true
})

const emit = defineEmits<{
  success: []
}>()

const form = ref({
  email: '',
  password: ''
})

const codeForm = ref({
  email: '',
  code: ''
})

const loginMode = ref<'password' | 'code'>('password')
const loading = ref(false)
const codeSending = ref(false)
const codeCountdown = ref(0)
const googleLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

let countdownTimer: ReturnType<typeof setInterval> | null = null

const onLoginSuccess = async (token: string, userId: string) => {
  localStorage.setItem('token', token)
  localStorage.setItem('userId', userId)
  await initAuth()

  emit('success')

  if (props.redirectOnSuccess) {
    setTimeout(() => navigateTo('/profile'), 1000)
  }
}

const sendCode = async () => {
  if (!codeForm.value.email) {
    errorMessage.value = '请输入邮箱地址'
    return
  }

  codeSending.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await post('/api/auth/send-code', { email: codeForm.value.email })
    if (response.success) {
      successMessage.value = '验证码已发送'
      codeCountdown.value = 60
      countdownTimer = setInterval(() => {
        codeCountdown.value--
        if (codeCountdown.value <= 0 && countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }, 1000)
    }
  } catch (error: any) {
    errorMessage.value = error.data?.message || '发送验证码失败'
  } finally {
    codeSending.value = false
  }
}

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await post('/api/auth/login', form.value)
    if (response.success) {
      await onLoginSuccess(response.token, response.user._id)
    }
  } catch (error: any) {
    errorMessage.value = error.data?.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}

const handleCodeLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await post('/api/auth/verify-code', {
      email: codeForm.value.email,
      code: codeForm.value.code
    })

    if (response.success) {
      await onLoginSuccess(response.token, response.user._id)
    }
  } catch (error: any) {
    errorMessage.value = error.data?.message || '验证码错误或已过期'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  googleLoading.value = true
  errorMessage.value = ''

  try {
    if (!window.google) {
      await new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.onload = resolve
        document.head.appendChild(script)
      })
    }

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: useRuntimeConfig().public.googleClientId,
      scope: 'email profile',
      callback: async (response: any) => {
        try {
          if (response.code) {
            const loginResponse = await post('/api/auth/google', {
              code: response.code
            })

            if (loginResponse.success) {
              await onLoginSuccess(loginResponse.token, loginResponse.user._id)
            }
          }
        } catch (error: any) {
          errorMessage.value = error.data?.message || 'Google 登录失败'
        } finally {
          googleLoading.value = false
        }
      },
      error_callback: (error: any) => {
        console.error('Google auth error:', error)
        errorMessage.value = 'Google 登录失败，请重试'
        googleLoading.value = false
      }
    })

    client.requestCode()
  } catch (error: any) {
    errorMessage.value = 'Google 登录初始化失败'
    googleLoading.value = false
  }
}

// Expose reset for modal usage
const reset = () => {
  form.value = { email: '', password: '' }
  codeForm.value = { email: '', code: '' }
  loginMode.value = 'password'
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = false
  googleLoading.value = false
}

defineExpose({ reset })
</script>
