import { type AxiosResponse } from 'axios'
import { api } from '../../lib/api.ts'

export type Institution = {
    id: string
    name: string
    slug: string
    description: string | null
    address: string | null
    phone: string | null
    email: string | null
    website: string | null
    logoUrl: string | null
    isActive: boolean
    createdAt: string
    _count: { departments: number; memberships: number }
}

export type Department = {
    id: string
    name: string
    institutionId: string
    classes: Class[]
    _count: { classes: number }
}

export type Class = {
    id: string
    name: string
    year: number
    departmentId: string
}

export type Member = {
    id: string
    role: string
    joinedAt: string
    user: { id: string; email: string; firstName: string; lastName: string }
    class: { id: string; name: string } | null
}

type InstitutionFull = Institution & { departments: Department[] }

const base = '/institutions'

export const institutionApi = {
    list: () =>
        api.get<Institution[]>(base).then((r: AxiosResponse<Institution[]>) => r.data),
    get: (id: string) =>
        api.get<InstitutionFull>(`${base}/${id}`).then((r: AxiosResponse<InstitutionFull>) => r.data),
    create: (data: { name: string; slug: string; description?: string }) =>
        api.post<Institution>(base, data).then((r: AxiosResponse<Institution>) => r.data),
    update: (id: string, data: Partial<{ name: string; description: string }>) =>
        api.patch<Institution>(`${base}/${id}`, data).then((r: AxiosResponse<Institution>) => r.data),
    delete: (id: string) => api.delete(`${base}/${id}`),

    createDepartment: (institutionId: string, name: string) =>
        api.post<Department>(`${base}/${institutionId}/departments`, { name }).then((r: AxiosResponse<Department>) => r.data),
    deleteDepartment: (institutionId: string, deptId: string) =>
        api.delete(`${base}/${institutionId}/departments/${deptId}`),

    createClass: (institutionId: string, data: { name: string; year: number; departmentId: string }) =>
        api.post<Class>(`${base}/${institutionId}/classes`, data).then((r: AxiosResponse<Class>) => r.data),
    deleteClass: (institutionId: string, classId: string) =>
        api.delete(`${base}/${institutionId}/classes/${classId}`),

    listMembers: (institutionId: string) =>
        api.get<Member[]>(`${base}/${institutionId}/members`).then((r: AxiosResponse<Member[]>) => r.data),
    addMember: (institutionId: string, data: { userId: string; role: string; classId?: string }) =>
        api.post<Member>(`${base}/${institutionId}/members`, data).then((r: AxiosResponse<Member>) => r.data),
    removeMember: (institutionId: string, memberId: string) =>
        api.delete(`${base}/${institutionId}/members/${memberId}`),
}
