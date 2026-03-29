import { type AxiosResponse } from 'axios'
import { api } from '../../lib/api.ts'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type TaskItem = {
    id: string
    title: string
    description: string | null
    status: TaskStatus
    priority: TaskPriority
    position: number
    dueDate: string | null
    createdAt: string
    updatedAt: string
    course: { id: string; title: string } | null
    assignment: { id: string; title: string } | null
}

export const taskApi = {
    list: () => api.get<TaskItem[]>('/tasks').then((r: AxiosResponse<TaskItem[]>) => r.data),
    calendar: (from?: string, to?: string) =>
        api.get<TaskItem[]>('/tasks/calendar', { params: { from, to } }).then((r: AxiosResponse<TaskItem[]>) => r.data),
    create: (data: { title: string; description?: string; status?: TaskStatus; priority?: TaskPriority; dueDate?: string }) =>
        api.post<TaskItem>('/tasks', data).then((r: AxiosResponse<TaskItem>) => r.data),
    update: (id: string, data: Partial<{ title: string; description: string; status: TaskStatus; priority: TaskPriority; dueDate: string | null }>) =>
        api.patch<TaskItem>(`/tasks/${id}`, data).then((r: AxiosResponse<TaskItem>) => r.data),
    remove: (id: string) => api.delete(`/tasks/${id}`),
    reorder: (tasks: Array<{ id: string; status: TaskStatus; position: number }>) =>
        api.post<TaskItem[]>('/tasks/reorder', { tasks }).then((r: AxiosResponse<TaskItem[]>) => r.data),
}
