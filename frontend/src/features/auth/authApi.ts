import { type AxiosResponse } from 'axios'
import { api } from '../../lib/api.ts'

type AuthResponse = {
    accessToken: string
    refreshToken: string
}

type RegisterPayload = {
    email: string
    password: string
    firstName: string
    lastName: string
    roleName: 'STUDENT' | 'TEACHER' | 'PARENT' | 'INSTITUTION_ADMIN'
}

type LoginPayload = {
    email: string
    password: string
}

type MeResponse = { userId: string; role: string; email: string }

export const authApi = {
    register: (payload: RegisterPayload) =>
        api.post<AuthResponse>('/auth/register', payload).then((r: AxiosResponse<AuthResponse>) => r.data),

    login: (payload: LoginPayload) =>
        api.post<AuthResponse>('/auth/login', payload).then((r: AxiosResponse<AuthResponse>) => r.data),

    logout: (refreshToken: string) =>
        api.post('/auth/logout', { refreshToken }),

    me: () =>
        api.get<MeResponse>('/auth/me').then((r: AxiosResponse<MeResponse>) => r.data),
}
