import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({ user: data.user, token: data.token, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return { success: true }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, message: err.response?.data?.message || 'Error al iniciar sesión' }
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/register', { nombre: name, email, password })
          set({ user: data.user, token: data.token, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return { success: true }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, message: err.response?.data?.message || 'Error al registrarse' }
        }
      },

      logout: () => {
        set({ user: null, token: null })
        delete api.defaults.headers.common['Authorization']
      },

      isAuthenticated: () => !!get().token,
    }),
    { name: 'moda-peru-auth' }
  )
)

export default useAuthStore
