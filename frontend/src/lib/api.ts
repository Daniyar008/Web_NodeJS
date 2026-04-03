// ─── API client — wraps native fetch with JWT auth ────────────────────────────

export const API_URL = (import.meta.env['VITE_API_URL'] as string | undefined) ?? 'http://localhost:4000'

// ─── Token storage ─────────────────────────────────────────────────────────────

const ACCESS_KEY = 'estudy-access'
const REFRESH_KEY = 'estudy-refresh'

export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY)
}

export function setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_KEY, accessToken)
    localStorage.setItem(REFRESH_KEY, refreshToken)
}

export function clearTokens() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem('estudy-role')
}

// ─── JWT decode (no signature verification — just reading payload) ─────────────

export type AccessPayload = { sub: string; email: string; role: string; exp: number }

export function decodeAccessToken(token: string): AccessPayload | null {
    try {
        const part = token.split('.')[1]
        if (!part) return null
        const padded = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=')
        return JSON.parse(atob(padded)) as AccessPayload
    } catch {
        return null
    }
}

// Map backend enum → frontend role key used in localStorage & routing
const ROLE_MAP: Record<string, string> = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    PARENT: 'parent',
    INSTITUTION_ADMIN: 'institution',
}

export function backendRoleToFrontend(role: string): string {
    return ROLE_MAP[role] ?? 'student'
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null

async function doRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem(REFRESH_KEY)
    if (!refreshToken) return false
    try {
        const res = await fetch(`${API_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        })
        if (!res.ok) return false
        const data = (await res.json()) as { accessToken: string; refreshToken: string }
        setTokens(data.accessToken, data.refreshToken)
        // Keep estudy-role in sync
        const payload = decodeAccessToken(data.accessToken)
        if (payload) {
            localStorage.setItem('estudy-role', backendRoleToFrontend(payload.role))
        }
        return true
    } catch {
        return false
    }
}

export async function apiFetch<T = unknown>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getAccessToken()
    const headers = new Headers(options.headers)
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)

    let res = await fetch(`${API_URL}${path}`, { ...options, headers })

    // Auto-refresh on 401
    if (res.status === 401 && token) {
        if (!refreshPromise) refreshPromise = doRefresh().finally(() => { refreshPromise = null })
        const refreshed = await refreshPromise
        if (refreshed) {
            const newToken = getAccessToken()
            if (newToken) headers.set('Authorization', `Bearer ${newToken}`)
            res = await fetch(`${API_URL}${path}`, { ...options, headers })
        }
    }

    if (!res.ok) {
        let message = `HTTP ${res.status}`
        try {
            const body = (await res.json()) as { message?: string }
            if (body.message) message = body.message
        } catch { /* ignore */ }
        throw new ApiClientError(message, res.status)
    }

    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
}

export class ApiClientError extends Error {
    readonly status: number
    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiClientError'
        this.status = status
    }
}

// ─── Auth endpoints ────────────────────────────────────────────────────────────

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

export interface RegisterPayload {
    email: string
    password: string
    firstName: string
    lastName: string
    /** STUDENT | TEACHER | PARENT | INSTITUTION_ADMIN */
    roleName: string
}

export interface LoginPayload {
    email: string
    password: string
}

export const auth = {
    register: (body: RegisterPayload) =>
        apiFetch<AuthTokens>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    login: (body: LoginPayload) =>
        apiFetch<AuthTokens>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    refresh: () => doRefresh(),

    logout: async () => {
        const refreshToken = localStorage.getItem(REFRESH_KEY)
        if (refreshToken) {
            try {
                await apiFetch('/api/auth/logout', {
                    method: 'POST',
                    body: JSON.stringify({ refreshToken }),
                })
            } catch { /* ignore — still clear local tokens */ }
        }
        clearTokens()
    },

    forgotPassword: (email: string) =>
        apiFetch<{ message: string }>('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    resetPassword: (token: string, password: string) =>
        apiFetch<{ message: string }>('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password }),
        }),
}

// ─── Courses ───────────────────────────────────────────────────────────────────

export interface CourseListItem {
    id: string
    title: string
    description: string | null
    coverUrl: string | null
    status: string
    isPaid: boolean
    priceCents: number
    currency: string
    author: { id: string; email: string; firstName: string; lastName: string }
    _count: { modules: number; enrollments: number }
    updatedAt: string
    createdAt: string
}

export interface CourseDetail extends CourseListItem {
    modules: Array<{
        id: string
        title: string
        order: number
        lessons: Array<{ id: string; title: string; type: string; order: number }>
    }>
}

export const courses = {
    list: (filter?: 'me') => {
        const qs = filter === 'me' ? '?mine=true' : ''
        return apiFetch<CourseListItem[]>(`/api/courses${qs}`)
    },
    get: (id: string) => apiFetch<CourseDetail>(`/api/courses/${id}`),
    create: (body: { title: string; description?: string }) =>
        apiFetch<CourseDetail>('/api/courses', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<{ title: string; description: string; status: string }>) =>
        apiFetch<CourseDetail>(`/api/courses/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
        apiFetch<void>(`/api/courses/${id}`, { method: 'DELETE' }),
    teacherStats: () =>
        apiFetch<{ totalCourses: number; totalStudents: number; pendingSubmissions: number }>('/api/courses/teacher/stats'),

    // Modules
    createModule: (courseId: string, body: { title: string; order?: number }) =>
        apiFetch<{ id: string; title: string; order: number }>(`/api/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(body) }),
    updateModule: (moduleId: string, body: { title?: string; order?: number }) =>
        apiFetch<{ id: string; title: string; order: number }>(`/api/courses/modules/${moduleId}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteModule: (moduleId: string) =>
        apiFetch<void>(`/api/courses/modules/${moduleId}`, { method: 'DELETE' }),

    // Lessons
    createLesson: (moduleId: string, body: { title: string; type?: string; content?: string; videoUrl?: string; order?: number }) =>
        apiFetch<{ id: string; title: string; type: string; order: number }>(`/api/courses/modules/${moduleId}/lessons`, { method: 'POST', body: JSON.stringify(body) }),
    updateLesson: (lessonId: string, body: { title?: string; type?: string; content?: string; videoUrl?: string }) =>
        apiFetch<{ id: string; title: string; type: string; order: number }>(`/api/courses/lessons/${lessonId}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteLesson: (lessonId: string) =>
        apiFetch<void>(`/api/courses/lessons/${lessonId}`, { method: 'DELETE' }),

    // Tests
    upsertTest: (lessonId: string, body: { title: string; timeLimit?: number; passingScore?: number; questions: Array<{ text: string; type: 'SINGLE' | 'MULTIPLE' | 'TEXT'; options?: Array<{ text: string; isCorrect: boolean }> }> }) =>
        apiFetch<unknown>(`/api/courses/lessons/${lessonId}/test`, { method: 'PUT', body: JSON.stringify(body) }),
}

// ─── Student ───────────────────────────────────────────────────────────────────

export interface ApiAchievement {
    id: string; code: string; title: string; description: string; icon: string | null
    category: 'LEARNING' | 'STREAK' | 'TESTS' | 'SOCIAL'; xpReward: number
}
export interface StudentUnlocked {
    id: string; achievementId: string; unlockedAt: string
    achievement: ApiAchievement
}
export interface AchievementsResponse {
    all: ApiAchievement[]; unlocked: StudentUnlocked[]; unlockedIds: string[]
}
export interface StudentProfile {
    user: { id: string; email: string; firstName: string; lastName: string; role: { name: string } }
    gamification: { xp: number; level: number; streak: number }
    achievements: StudentUnlocked[]
}

export interface EnrolledCourse {
    id: string
    courseId: string
    enrolledAt: string
    course: CourseDetail & { author: { id: string; firstName: string; lastName: string } }
    progress: Array<{ lessonId: string; completed: boolean }>
}

export const student = {
    me: () => apiFetch<StudentProfile>('/api/student/me'),
    coursesAvailable: () => apiFetch<CourseListItem[]>('/api/student/courses/available'),
    coursesEnrolled: () => apiFetch<EnrolledCourse[]>('/api/student/courses/enrolled'),
    enroll: (courseId: string) =>
        apiFetch<EnrolledCourse>('/api/student/courses/enroll', { method: 'POST', body: JSON.stringify({ courseId }) }),
    progress: (courseId: string) =>
        apiFetch<{ enrollmentId: string; completedLessons: number; totalLessons: number; percent: number }>(`/api/student/courses/${courseId}/progress`),
    completeLesson: (courseId: string, lessonId: string) =>
        apiFetch('/api/student/courses/' + courseId + '/lessons/' + lessonId + '/complete', { method: 'POST' }),
    achievements: () => apiFetch<AchievementsResponse>('/api/student/achievements'),
}

// ─── Tasks ─────────────────────────────────────────────────────────────────────

export type TodoStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
export type TodoPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Task {
    id: string
    title: string
    description: string | null
    status: TodoStatus
    priority: TodoPriority
    dueDate: string | null
    position: number
    courseId: string | null
    assignmentId: string | null
    course: { id: string; title: string } | null
    assignment: { id: string; title: string } | null
    createdAt: string
    updatedAt: string
}

export const tasks = {
    list: () => apiFetch<Task[]>('/api/tasks'),
    calendar: (from?: string, to?: string) => {
        const p = new URLSearchParams()
        if (from) p.set('from', from)
        if (to) p.set('to', to)
        return apiFetch<Task[]>(`/api/tasks/calendar?${p}`)
    },
    create: (body: { title: string; dueDate?: string; description?: string; priority?: string; status?: string; courseId?: string; assignmentId?: string }) =>
        apiFetch<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<{ title: string; status: string; priority: string; dueDate: string; description: string; courseId: string; assignmentId: string }>) =>
        apiFetch<Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => apiFetch<void>(`/api/tasks/${id}`, { method: 'DELETE' }),
    reorder: (items: { id: string; status: string; position: number }[]) =>
        apiFetch<Task[]>('/api/tasks/reorder', { method: 'POST', body: JSON.stringify({ tasks: items }) }),
}

// ─── Chat ──────────────────────────────────────────────────────────────────────

export interface ChatContact { id: string; firstName: string; lastName: string; email: string }
export interface ChatPreview { id: string; title: string | null; type: string; participants: ChatContact[]; lastMessage: { id: string; content: string; createdAt: string } | null }
export interface ChatMessage { id: string; content: string; senderId: string; createdAt: string; sender: ChatContact }

export const chat = {
    contacts: () => apiFetch<ChatContact[]>('/api/chat/contacts'),
    list: () => apiFetch<ChatPreview[]>('/api/chat/chats'),
    create: (participantId: string) =>
        apiFetch<ChatPreview>('/api/chat/chats', { method: 'POST', body: JSON.stringify({ participantId }) }),
    messages: (chatId: string) => apiFetch<ChatMessage[]>(`/api/chat/chats/${chatId}/messages`),
    send: (chatId: string, content: string) =>
        apiFetch<ChatMessage>(`/api/chat/chats/${chatId}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
    markRead: (chatId: string) =>
        apiFetch(`/api/chat/chats/${chatId}/read`, { method: 'POST' }),
}

// ─── Notifications ─────────────────────────────────────────────────────────────

export interface Notification { id: string; title: string; body: string; type: string; link: string | null; isRead: boolean; createdAt: string }

export const notifications = {
    list: (limit = 30) => apiFetch<Notification[]>(`/api/notifications?limit=${limit}`),
    unreadCount: () => apiFetch<{ count: number }>('/api/notifications/unread-count'),
    markRead: (id: string) => apiFetch('/api/notifications/' + id + '/read', { method: 'POST' }),
    markAllRead: () => apiFetch('/api/notifications/read-all', { method: 'POST' }),
}

// ─── Tournaments ───────────────────────────────────────────────────────────────

export interface Tournament {
    id: string; title: string; description: string; type: string; status: string
    maxScore: number; startsAt: string; endsAt: string
    _count?: { participants: number }; joined?: boolean
}
export interface LeaderboardEntry { rank: number; score: number; user: { id: string; firstName: string; lastName: string } }

export const tournaments = {
    list: () => apiFetch<Tournament[]>('/api/tournaments'),
    get: (id: string) => apiFetch<Tournament>(`/api/tournaments/${id}`),
    leaderboard: (id: string) => apiFetch<LeaderboardEntry[]>(`/api/tournaments/${id}/leaderboard`),
    join: (id: string) => apiFetch('/api/tournaments/' + id + '/join', { method: 'POST' }),
    leave: (id: string) => apiFetch(`/api/tournaments/${id}/leave`, { method: 'DELETE' }),
    submitScore: (id: string, score: number) =>
        apiFetch(`/api/tournaments/${id}/score`, { method: 'POST', body: JSON.stringify({ score }) }),
}

// ─── AI ────────────────────────────────────────────────────────────────────────

export interface AiRecommendation { title: string; description: string; actionLabel: string; actionPath: string }
export interface AiChatResponse { source: string; answer: string }

export const ai = {
    recommendations: (limit = 5) => apiFetch<AiRecommendation[]>(`/api/ai/recommendations?limit=${limit}`),
    chat: (message: string, context?: string) =>
        apiFetch<AiChatResponse>('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message, context }) }),
}

// ─── Payments ──────────────────────────────────────────────────────────────────

export interface SubscriptionPlan { id: string; name: string; description: string; priceCents: number; interval: string; isActive: boolean; currency?: string }
export interface UserSubscription { id: string; status: string; planId: string; currentPeriodEnd?: string; plan?: SubscriptionPlan }
export interface BillingAccess { hasSubscription: boolean; features: string[] }
export interface PurchaseHistoryItem { id: string; courseId: string; status: string; amountCents: number; currency: string; createdAt: string; course?: { title: string } }

export const payments = {
    plans: () => apiFetch<SubscriptionPlan[]>('/api/payments/plans'),
    subscription: () => apiFetch<UserSubscription | null>('/api/payments/subscription'),
    access: () => apiFetch<BillingAccess>('/api/payments/access'),
    marketplace: () => apiFetch<CourseListItem[]>('/api/payments/marketplace'),
    purchases: () => apiFetch<PurchaseHistoryItem[]>('/api/payments/purchases'),
    checkoutSubscription: (planId: string, successUrl?: string, cancelUrl?: string) =>
        apiFetch<{ checkoutUrl?: string; provider: string; subscription?: unknown }>('/api/payments/checkout/subscription', {
            method: 'POST', body: JSON.stringify({ planId, successUrl, cancelUrl }),
        }),
    checkoutCourse: (courseId: string, successUrl?: string, cancelUrl?: string) =>
        apiFetch<{ checkoutUrl?: string; provider: string }>(`/api/payments/checkout/course/${courseId}`, {
            method: 'POST', body: JSON.stringify({ successUrl, cancelUrl }),
        }),
    cancelSubscription: () =>
        apiFetch<{ message: string }>('/api/payments/subscription/cancel', { method: 'POST' }),
}

// ─── Institution ───────────────────────────────────────────────────────────────

export interface Institution {
    id: string; name: string; slug: string; description: string | null
    address: string | null; phone: string | null; email: string | null; website: string | null; logoUrl: string | null
    departments?: Array<{ id: string; name: string; _count?: { classes: number } }>
    classes?: Array<{ id: string; name: string; year: number; departmentId: string }>
    _count?: { members: number; departments: number; classes: number }
}
export interface InstitutionMember {
    id: string; role: string
    user: { id: string; email: string; firstName: string; lastName: string }
    class?: { id: string; name: string } | null
}

export const institution = {
    list: () => apiFetch<Institution[]>('/api/institutions'),
    get: (id: string) => apiFetch<Institution>(`/api/institutions/${id}`),
    update: (id: string, body: Partial<{ name: string; description: string; address: string; phone: string; email: string; website: string; logoUrl: string }>) =>
        apiFetch<Institution>(`/api/institutions/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    members: (id: string) => apiFetch<InstitutionMember[]>(`/api/institutions/${id}/members`),
    addMember: (id: string, body: { userId: string; role: string; classId?: string }) =>
        apiFetch<InstitutionMember>(`/api/institutions/${id}/members`, { method: 'POST', body: JSON.stringify(body) }),
    removeMember: (id: string, memberId: string) =>
        apiFetch<void>(`/api/institutions/${id}/members/${memberId}`, { method: 'DELETE' }),
    createDepartment: (id: string, body: { name: string }) =>
        apiFetch<{ id: string; name: string }>(`/api/institutions/${id}/departments`, { method: 'POST', body: JSON.stringify(body) }),
    updateDepartment: (id: string, deptId: string, body: { name: string }) =>
        apiFetch<{ id: string; name: string }>(`/api/institutions/${id}/departments/${deptId}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteDepartment: (id: string, deptId: string) =>
        apiFetch<void>(`/api/institutions/${id}/departments/${deptId}`, { method: 'DELETE' }),
    createClass: (id: string, body: { name: string; year: number; departmentId: string }) =>
        apiFetch<{ id: string; name: string; year: number; departmentId: string }>(`/api/institutions/${id}/classes`, { method: 'POST', body: JSON.stringify(body) }),
    updateClass: (id: string, classId: string, body: Partial<{ name: string; year: number; departmentId: string }>) =>
        apiFetch<{ id: string; name: string; year: number }>(`/api/institutions/${id}/classes/${classId}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteClass: (id: string, classId: string) =>
        apiFetch<void>(`/api/institutions/${id}/classes/${classId}`, { method: 'DELETE' }),
}

// ─── Parent ────────────────────────────────────────────────────────────────────

export interface ParentChild {
    id: string
    student: { id: string; firstName: string; lastName: string; email: string }
}
export interface ChildProgress {
    enrollments: Array<{
        courseId: string
        course: { title: string }
        completedLessons: number
        totalLessons: number
        percent: number
    }>
    gamification: { xp: number; level: number; streak: number }
}

export interface ParentGoal {
    id: string
    title: string
    description: string | null
    targetXp: number
    reward: string | null
    achieved: boolean
    achievedAt: string | null
    studentId: string
    createdAt: string
}

export const parent = {
    children: () => apiFetch<ParentChild[]>('/api/parent/children'),
    childProgress: (studentId: string) => apiFetch<ChildProgress>(`/api/parent/children/${studentId}/progress`),
    goals: (studentId: string) => apiFetch<ParentGoal[]>(`/api/parent/children/${studentId}/goals`),
    createGoal: (body: { studentId: string; title: string; description?: string; targetXp: number; reward?: string }) =>
        apiFetch<ParentGoal>('/api/parent/goals', { method: 'POST', body: JSON.stringify(body) }),
    updateGoal: (id: string, body: { title?: string; description?: string; targetXp?: number; reward?: string; achieved?: boolean }) =>
        apiFetch<ParentGoal>(`/api/parent/goals/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteGoal: (id: string) =>
        apiFetch<void>(`/api/parent/goals/${id}`, { method: 'DELETE' }),
    checkGoals: (studentId: string) =>
        apiFetch<ParentGoal[]>(`/api/parent/children/${studentId}/goals/check`, { method: 'POST' }),
    teachers: () => apiFetch<Array<{ id: string; firstName: string; lastName: string; email: string }>>('/api/parent/teachers'),
}

// ─── Uploads ───────────────────────────────────────────────────────────────────

async function uploadFile(path: string, file: File, fieldName: string): Promise<{ url: string }> {
    const token = getAccessToken()
    const form = new FormData()
    form.append(fieldName, file)
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers, body: form })
    if (!res.ok) {
        let msg = `HTTP ${res.status}`
        try { const b = await res.json() as { message?: string }; if (b.message) msg = b.message } catch { /* */ }
        throw new ApiClientError(msg, res.status)
    }
    return res.json() as Promise<{ url: string }>
}

export const uploads = {
    avatar: (file: File) => uploadFile('/api/uploads/avatar', file, 'avatar'),
    cover: (courseId: string, file: File) => uploadFile(`/api/uploads/cover/${courseId}`, file, 'cover'),
    media: (file: File) => uploadFile('/api/uploads/media', file, 'file'),
}
