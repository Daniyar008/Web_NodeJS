import { type AxiosResponse } from 'axios'
import { api } from '../../lib/api.ts'

export type StudentProfile = {
    user: { id: string; email: string; firstName: string; lastName: string; role: { name: string } }
    gamification: { xp: number; level: number; streak: number }
    achievements: Array<{ id: string; unlockedAt: string; achievement: { id: string; title: string; description: string; category: string } }>
}

export type AvailableCourse = {
    id: string
    title: string
    description: string | null
    _count: { modules: number; enrollments: number }
    author: { firstName: string; lastName: string }
}

export type EnrolledCourse = {
    id: string
    course: {
        id: string
        title: string
        description: string | null
        modules: Array<{ id: string; title: string; lessons: Array<{ id: string; title: string; type: string }> }>
    }
    progress: Array<{ lessonId: string; completed: boolean }>
}

export type CourseProgress = {
    enrollmentId: string
    course: {
        id: string
        title: string
        modules: Array<{ id: string; title: string; lessons: Array<{ id: string; title: string; type: string }> }>
    }
    completedLessons: number
    totalLessons: number
    percent: number
    progress: Array<{ lessonId: string; completed: boolean }>
}

export const studentApi = {
    me: () => api.get<StudentProfile>('/student/me').then((r: AxiosResponse<StudentProfile>) => r.data),

    availableCourses: () =>
        api.get<AvailableCourse[]>('/student/courses/available').then((r: AxiosResponse<AvailableCourse[]>) => r.data),

    enrolledCourses: () =>
        api.get<EnrolledCourse[]>('/student/courses/enrolled').then((r: AxiosResponse<EnrolledCourse[]>) => r.data),

    enroll: (courseId: string) =>
        api.post('/student/courses/enroll', { courseId }),

    progress: (courseId: string) =>
        api.get<CourseProgress>(`/student/courses/${courseId}/progress`).then((r: AxiosResponse<CourseProgress>) => r.data),

    completeLesson: (courseId: string, lessonId: string) =>
        api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`),

    achievements: () =>
        api.get('/student/achievements').then((r: AxiosResponse<{ all: unknown[]; unlocked: unknown[]; unlockedIds: string[] }>) => r.data),
}
