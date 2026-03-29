import axios, { type InternalAxiosRequestConfig } from 'axios'

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

export const api = axios.create({
    baseURL: import.meta.env['VITE_API_URL'] ?? 'http://localhost:4000/api',
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        const axiosError = error as import('axios').AxiosError
        const original = axiosError.config as RetryableConfig | undefined

        if (axiosError.response?.status === 401 && !original?._retry) {
            if (original) original._retry = true
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
                try {
                    const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
                        `${import.meta.env['VITE_API_URL'] ?? 'http://localhost:4000/api'}/auth/refresh`,
                        { refreshToken },
                    )
                    localStorage.setItem('accessToken', data.accessToken)
                    localStorage.setItem('refreshToken', data.refreshToken)
                    if (original) {
                        original.headers.set('Authorization', `Bearer ${data.accessToken}`)
                        return api(original)
                    }
                } catch {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    window.location.href = '/login'
                }
            }
        }
        return Promise.reject(error)
    },
)
