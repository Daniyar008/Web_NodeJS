import { type AxiosResponse } from 'axios'
import { api } from '../../lib/api.ts'

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT'

export type Lesson = {
    id: string
    title: string
    type: LessonType
    content: string | null
    videoUrl: string | null
    order: number
    moduleId: string
}

export type CourseModule = {
    id: string
    title: string
    order: number
    courseId: string
    lessons: Lesson[]
}

export type Course = {
    id: string
    title: string
    description: string | null
    coverUrl: string | null
    status: CourseStatus
    isPaid: boolean
    priceCents: number
    currency: string
    authorId: string
    author: { id: string; email: string; firstName: string; lastName: string }
    modules: CourseModule[]
    _count: { modules: number; enrollments: number }
    createdAt: string
    updatedAt: string
}

export type TeacherStats = {
    totalCourses: number
    totalStudents: number
    pendingSubmissions: number
}

const base = '/courses'

export const courseApi = {
    list: (mine = false) =>
        api.get<Course[]>(`${base}${mine ? '?mine=true' : ''}`).then((r: AxiosResponse<Course[]>) => r.data),

    get: (id: string) =>
        api.get<Course>(`${base}/${id}`).then((r: AxiosResponse<Course>) => r.data),

    create: (data: { title: string; description?: string }) =>
        api.post<Course>(base, data).then((r: AxiosResponse<Course>) => r.data),

    update: (id: string, data: Partial<{ title: string; description: string; status: CourseStatus }>) =>
        api.patch<Course>(`${base}/${id}`, data).then((r: AxiosResponse<Course>) => r.data),

    delete: (id: string) => api.delete(`${base}/${id}`),

    stats: () =>
        api.get<TeacherStats>(`${base}/teacher/stats`).then((r: AxiosResponse<TeacherStats>) => r.data),

    createModule: (courseId: string, title: string) =>
        api.post<CourseModule>(`${base}/${courseId}/modules`, { title }).then((r: AxiosResponse<CourseModule>) => r.data),

    deleteModule: (moduleId: string) => api.delete(`${base}/modules/${moduleId}`),

    reorderModules: (courseId: string, order: string[]) =>
        api.post<CourseModule[]>(`${base}/${courseId}/modules/reorder`, { order }).then((r: AxiosResponse<CourseModule[]>) => r.data),

    createLesson: (moduleId: string, data: { title: string; type: LessonType }) =>
        api.post<Lesson>(`${base}/modules/${moduleId}/lessons`, data).then((r: AxiosResponse<Lesson>) => r.data),

    updateLesson: (lessonId: string, data: Partial<{ title: string; content: string; videoUrl: string; type: LessonType }>) =>
        api.patch<Lesson>(`${base}/lessons/${lessonId}`, data).then((r: AxiosResponse<Lesson>) => r.data),

    deleteLesson: (lessonId: string) => api.delete(`${base}/lessons/${lessonId}`),
}
