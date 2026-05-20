import { computed } from 'vue'
import { useUser } from './useAuth'

export const isAdmin = computed(() => {
  const { user } = useUser()
  return user.value?.role === 'admin'
})

export const requireAdmin = () => {
  const { user } = useUser()
  
  if (!user.value) {
    navigateTo('/login')
    return false
  }
  
  if (user.value.role !== 'admin') {
    navigateTo('/')
    return false
  }
  
  return true
}

export const useAdmin = () => ({
  isAdmin,
  requireAdmin
})
