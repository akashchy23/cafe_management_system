import axios from 'axios'
import { auth } from '../firebase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach Firebase UID and token
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser
    if (currentUser) {
      config.headers['x-user-uid'] = currentUser.uid
      config.headers['x-user-email'] = currentUser.email || ''
      try {
        const token = await currentUser.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
      } catch (err) {
        // Fallback gracefully
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
