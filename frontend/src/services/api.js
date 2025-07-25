import axios from 'axios'

// Configuración base de axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Servicios de Auth
export const authApi = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (userData) => api.post('/api/auth/register', userData),
  profile: () => api.get('/api/auth/profile'),
  logout: () => api.post('/api/auth/logout')
}

// Servicios de Records
export const recordsApi = {
  getAll: () => api.get('/api/records'),
  getById: (id) => api.get(`/api/records/${id}`),
  create: (data) => api.post('/api/records', data),
  update: (id, data) => api.put(`/api/records/${id}`, data),
  delete: (id) => api.delete(`/api/records/${id}`)
}

// Servicios de Users
export const usersApi = {
  getAll: (q = '') => api.get('/api/users', { params: { q } }),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (data) => api.post('/api/users', data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`)
}

export const auditApi = {
  getPaginated : (page = 1, limit = 7) =>
    api.get('/api/audit', { params: { page, limit } }),
  getTopActive : () => api.get('/api/audit/top-active'),
  getStats     : (params) => api.get('/api/audit/stats', { params }),
  // existentes
  getAll       : () => api.get('/api/audit'),
  getByUser    : (userId) => api.get(`/api/audit/user/${userId}`),
  getByRecord  : (recordId) => api.get(`/api/audit/record/${recordId}`)
}

export default api