import { defineStore } from 'pinia'

type User = {
  id: number
  name: string
  email: string
  is_admin: '0' | '1'
}

type Credentials = {
  email: string
  password: string
}

type RegistrationInfo = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  async function fetchUser() {
    const { data } = await useApiFetch('/user')
    user.value = data.value as User
  }

  async function register(info: RegistrationInfo) {
    if (!info.name || !info.email || !info.password || !info.password_confirmation) return
    await useApiFetch('/csrf-cookie', {
      headers: {
        Accept: 'application/json',
      },
    })

    const register = await useApiFetch('/register', {
      method: 'POST',
      body: info,
      headers: {
        Accept: 'application/json',
      },
    })

    if (!register.error.value) {
      await fetchUser()
    }

    return register
  }

  async function login(credentials: Credentials) {
    if (!credentials.email || !credentials.password) return
    await useApiFetch('/csrf-cookie', {
      headers: {
        Accept: 'application/json',
      },
    })

    const login = await useApiFetch('/login', {
      method: 'POST',
      body: credentials,
      headers: {
        Accept: 'application/json',
      },
    })

    if (!login.error.value) {
      await fetchUser()
    }

    return login
  }

  async function logout() {
    await useApiFetch('/logout', {
      method: 'POST',
    })

    user.value = null
    navigateTo('/auth/login')
  }

  return { user, register, login, isLoggedIn, fetchUser, logout }
})
