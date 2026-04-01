// ─── Types ───────────────────────────────────────────────────────────────────

export interface CourseProgress {
    id: string
    title: string
    category: string
    categoryColor: string
    watched: number
    total: number
    icon: string
    bgColor: string
}

export interface ContinueCourse {
    id: string
    title: string
    category: string
    categoryColor: string
    categoryBg: string
    mentor: string
    mentorAvatar: string
    thumbnail: string
    duration: string
    progress: number
}

export interface LessonRow {
    id: string
    mentor: string
    mentorAvatar: string
    role: string
    type: string
    typeBg: string
    typeColor: string
    description: string
    date: string
}

export interface MentorItem {
    id: string
    name: string
    avatar: string
    specialty: string
    students: number
    following: boolean
}

export interface ActivityPoint {
    label: string
    value: number
}

export interface Announcement {
    id: string
    title: string
    body: string
    time: string
    icon: string
    color: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const courseProgress: CourseProgress[] = [
    {
        id: 'cp1',
        title: 'UI/UX Design',
        category: 'Дизайн',
        categoryColor: '#7c6cf8',
        watched: 2,
        total: 8,
        icon: '✦',
        bgColor: '#f0eeff',
    },
    {
        id: 'cp2',
        title: 'Branding',
        category: 'Маркетинг',
        categoryColor: '#f48f5e',
        watched: 3,
        total: 8,
        icon: '◈',
        bgColor: '#fff3ee',
    },
    {
        id: 'cp3',
        title: 'Front End',
        category: 'Разработка',
        categoryColor: '#43c38d',
        watched: 6,
        total: 12,
        icon: '⬡',
        bgColor: '#edfbf4',
    },
]

export const continueCourses: ContinueCourse[] = [
    {
        id: 'cc1',
        title: "Beginner's Guide to Becoming a Professional Front-End Developer",
        category: 'FRONT END',
        categoryColor: '#43c38d',
        categoryBg: 'rgba(67,195,141,0.12)',
        mentor: 'Leonardo Samsul',
        mentorAvatar: 'LS',
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
        duration: '4ч 20м',
        progress: 45,
    },
    {
        id: 'cc2',
        title: 'Optimizing User Experience with the Best UI/UX Design',
        category: 'UI/UX DESIGN',
        categoryColor: '#7c6cf8',
        categoryBg: 'rgba(124,108,248,0.12)',
        mentor: 'Bayu Salto',
        mentorAvatar: 'BS',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
        duration: '6ч 10м',
        progress: 70,
    },
    {
        id: 'cc3',
        title: 'Reviving and Refreshing Company Image Through Effective Branding',
        category: 'BRANDING',
        categoryColor: '#f48f5e',
        categoryBg: 'rgba(244,143,94,0.12)',
        mentor: 'Padhang Satrio',
        mentorAvatar: 'PS',
        thumbnail: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&q=80',
        duration: '3ч 45м',
        progress: 20,
    },
]

export const lessons: LessonRow[] = [
    {
        id: 'l1',
        mentor: 'Padhang Satrio',
        mentorAvatar: 'PS',
        role: 'Ментор',
        type: 'UI/UX DESIGN',
        typeBg: 'rgba(124,108,248,0.1)',
        typeColor: '#7c6cf8',
        description: 'Understand Of UI/UX Design',
        date: '16.02.2026',
    },
    {
        id: 'l2',
        mentor: 'Leonardo Samsul',
        mentorAvatar: 'LS',
        role: 'Ментор',
        type: 'FRONT END',
        typeBg: 'rgba(67,195,141,0.1)',
        typeColor: '#43c38d',
        description: 'HTML & CSS Fundamentals',
        date: '18.02.2026',
    },
    {
        id: 'l3',
        mentor: 'Bayu Salto',
        mentorAvatar: 'BS',
        role: 'Ментор',
        type: 'BRANDING',
        typeBg: 'rgba(244,143,94,0.1)',
        typeColor: '#f48f5e',
        description: 'Brand Identity Core Principles',
        date: '20.02.2026',
    },
    {
        id: 'l4',
        mentor: 'Clara Mensah',
        mentorAvatar: 'CM',
        role: 'Ментор',
        type: 'FRONT END',
        typeBg: 'rgba(67,195,141,0.1)',
        typeColor: '#43c38d',
        description: 'React Hooks In Practice',
        date: '22.02.2026',
    },
]

export const mentors: MentorItem[] = [
    {
        id: 'm1',
        name: 'Padhang Satrio',
        avatar: 'PS',
        specialty: 'UI/UX Design',
        students: 1240,
        following: false,
    },
    {
        id: 'm2',
        name: 'Zakir Horizontal',
        avatar: 'ZH',
        specialty: 'Branding',
        students: 870,
        following: true,
    },
    {
        id: 'm3',
        name: 'Leonardo Samsul',
        avatar: 'LS',
        specialty: 'Front End',
        students: 2100,
        following: false,
    },
]

export const activityData: ActivityPoint[] = [
    { label: '1-10 мар', value: 35 },
    { label: '11-20 мар', value: 55 },
    { label: '21-31 мар', value: 82 },
    { label: '1-10 апр', value: 60 },
]

export const announcements: Announcement[] = [
    {
        id: 'a1',
        title: 'Новый курс по React 19',
        body: 'Leonardo добавил 3 новых модуля — не пропусти!',
        time: '10 мин назад',
        icon: '🆕',
        color: '#e8effa',
    },
    {
        id: 'a2',
        title: 'Экзамен по UI/UX через 2 дня',
        body: 'Подготовься к тесту — повтори модуль №4',
        time: '1 час назад',
        icon: '📝',
        color: '#fef9ee',
    },
    {
        id: 'a3',
        title: 'Сертификат готов',
        body: 'Ваш сертификат по Branding доступен для скачивания',
        time: 'вчера',
        icon: '🏆',
        color: '#edfbf4',
    },
]
