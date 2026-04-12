import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import type { AuthResponse, LoginRequest, RegisterRequest, PropertyCard, PropertyDetail, SearchParams, Page, City, Locality, InquiryRequest } from '@/types'

// Browser → use relative /api so Next.js rewrites proxy to the backend (avoids CORS)
// Server  → use the full URL for direct server-to-server calls
const api = axios.create({
  baseURL: typeof window !== 'undefined'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = useAuthStore.getState().accessToken
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = useAuthStore.getState().refreshToken
        if (!refreshToken) throw new Error('no refresh token')
        const base = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')
        const { data } = await axios.post(`${base}/auth/refresh-token`, { refreshToken })
        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        useAuthStore.getState().logout()
        if (typeof window !== 'undefined') window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ── Auth ────────────────────────────────────────────────────
export const authApi = {
  login:          (data: LoginRequest)           => api.post<AuthResponse>('/auth/login', data),
  register:       (data: RegisterRequest)        => api.post<AuthResponse>('/auth/register', data),
  verifyOtp:      (email: string, otp: string)   => api.post('/auth/verify-otp', { email, otp }),
  forgotPassword: (email: string)                => api.post('/auth/forgot-password', { email }),
  resetPassword:  (email: string, otp: string, newPassword: string) => api.post('/auth/reset-password', { email, otp, newPassword }),
}

// ── Properties ──────────────────────────────────────────────
export const propertyApi = {
  search:      (params: SearchParams)              => api.get<Page<PropertyCard>>('/properties', { params }),
  getById:     (id: string)                        => api.get<PropertyDetail>(`/properties/${id}`),
  getMyById:   (id: string)                        => api.get<PropertyDetail>(`/properties/${id}/my`),
  getFeatured: ()                                  => api.get<PropertyCard[]>('/properties/featured'),
  getSimilar:  (id: string)                        => api.get<PropertyCard[]>(`/properties/${id}/similar`),
  myListings:  (page = 0, size = 10)               => api.get<Page<PropertyCard>>('/properties/my-listings', { params: { page, size } }),
  create:      (data: object)                      => api.post<PropertyDetail>('/properties', data),
  update:      (id: string, data: object)          => api.put<PropertyDetail>(`/properties/${id}`, data),
  delete:      (id: string)                        => api.delete(`/properties/${id}`),
  sendInquiry: (propertyId: string, data: InquiryRequest) => api.post(`/properties/${propertyId}/inquiries`, data),
  uploadImage: (id: string, file: File, setPrimary = false) => {
    const form = new FormData()
    form.append('file', file)
    form.append('setPrimary', String(setPrimary))
    return api.post(`/properties/${id}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  deleteImage: (propertyId: string, imageId: string) => api.delete(`/properties/${propertyId}/images/${imageId}`),
}

// ── Search support ──────────────────────────────────────────
export const searchApi = {
  cities:       ()               => api.get<City[]>('/search/cities'),
  localities:   (cityId: string) => api.get<Locality[]>('/search/localities', { params: { cityId } }),
  autocomplete: (q: string)      => api.get<Locality[]>('/search/autocomplete', { params: { q } }),
  amenities:    ()               => api.get<{ id: string; name: string; category: string }[]>('/search/amenities'),
}

// ── Admin ───────────────────────────────────────────────────
export const adminApi = {
  getPending:     (page = 0)               => api.get('/admin/listings/pending', { params: { page } }),
  getListing:     (id: string)             => api.get(`/admin/listings/${id}`),
  getAllListings:  (status?: string, page = 0) => api.get('/admin/listings/all', { params: { status, page } }),
  approve:        (id: string)             => api.put(`/admin/listings/${id}/approve`),
  reject:         (id: string, reason: string) => api.put(`/admin/listings/${id}/reject`, { rejectionReason: reason }),
  toggleFeatured: (id: string)             => api.put(`/admin/listings/${id}/feature`),
  getUsers:       (page = 0, role?: string) => api.get('/admin/users', { params: { page, ...(role ? { role } : {}) } }),
  banUser:        (id: string, ban: boolean) => api.put(`/admin/users/${id}/ban`, null, { params: { ban } }),
  getOverview:    ()                       => api.get('/admin/analytics/overview'),
}
