// ─── Types ────────────────────────────────────────────────────────────────────

export type Achievement = {
    id: string
    emoji: string
    title: string
    bg: string
}

export type CourseProgressItem = {
    id: string
    name: string
    category: string
    progress: number      // 0–100
    grade?: number        // 0–100
    status: 'in-progress' | 'completed'
    color: string
}

export type SubjectGrade = {
    subject: string
    grade: number         // 0–100
    gpa: number           // 0.0–5.0
    letter: string        // A+, A, B+, …
    color: string
}

export type ProfileData = {
    displayName: string
    realName: string
    email: string
    avatar: string
    country: string
    role: 'student' | 'teacher' | 'parent' | 'institution'
    isVip: boolean
    streak: number
    maxStreak: number
    /** 28 booleans: index 0 = 27 days ago, index 27 = today */
    streakHistory: boolean[]
    coursesInProgress: number
    coursesCompleted: number
    gpa: number
    maxGpa: number
    institution: {
        name: string
        city: string
        type: 'school' | 'college' | 'university' | 'other'
        since: string
        pending: boolean
    }
    achievements: Achievement[]
    courseProgress: CourseProgressItem[]
    subjectGrades: SubjectGrade[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const COUNTRIES = [
    'Казахстан', 'Россия', 'Беларусь', 'Украина', 'Узбекистан',
    'Кыргызстан', 'Таджикистан', 'Туркменистан', 'Азербайджан', 'Грузия',
    'Германия', 'США', 'Великобритания', 'Турция', 'Другое',
]

export const INST_TYPES: Record<string, string> = {
    school: 'Школа',
    college: 'Колледж',
    university: 'Университет',
    other: 'Другое',
}

// ─── Mock data ────────────────────────────────────────────────────────────────

// 28-day streak history: last 14 days all active, before that sporadic
const STREAK_HISTORY: boolean[] = [
    true, false, true, true, false, true, true,    // 4 weeks ago
    false, true, true, false, true, false, true,   // 3 weeks ago
    true, true, true, true, true, true, true,      // 2 weeks ago  (streak starts)
    true, true, true, true, true, true, true,      // last week
]

export const mockProfile: ProfileData = {
    displayName: 'Аликхан Д.',
    realName: 'Аликхан Дауренов',
    email: 'alikhan.daurenov@edu.kz',
    avatar: 'https://i.pravatar.cc/120?img=3',
    country: 'Казахстан',
    role: 'teacher',
    isVip: true,

    streak: 14,
    maxStreak: 21,
    streakHistory: STREAK_HISTORY,

    coursesInProgress: 8,
    coursesCompleted: 23,
    gpa: 4.2,
    maxGpa: 5.0,

    institution: {
        name: 'Школа №12 им. Абая',
        city: 'Алматы',
        type: 'school',
        since: '2022',
        pending: false,
    },

    achievements: [
        { id: 'a1', emoji: '👑', title: 'Топ преподаватель', bg: '#fff3d4' },
        { id: 'a2', emoji: '🏆', title: '10 курсов завершено', bg: '#fde8d8' },
        { id: 'a3', emoji: '⛰️', title: 'Марафон 30 дней', bg: '#e8f5ff' },
        { id: 'a4', emoji: '🥇', title: 'Лучший наставник', bg: '#fff0e0' },
    ],

    courseProgress: [
        { id: 'cp1', name: 'UI/UX Design Basics', category: 'Дизайн', progress: 72, grade: 88, status: 'in-progress', color: '#43c38d' },
        { id: 'cp2', name: 'Advanced Figma', category: 'Дизайн', progress: 45, grade: 80, status: 'in-progress', color: '#6c8cf8' },
        { id: 'cp3', name: 'React от нуля', category: 'Программирование', progress: 60, grade: 92, status: 'in-progress', color: '#f86c8c' },
        { id: 'cp4', name: 'TypeScript Мастер', category: 'Программирование', progress: 100, grade: 96, status: 'completed', color: '#43c38d' },
        { id: 'cp5', name: 'Педагогика', category: 'Образование', progress: 100, grade: 85, status: 'completed', color: '#fba94c' },
        { id: 'cp6', name: 'Python Basics', category: 'Программирование', progress: 100, grade: 91, status: 'completed', color: '#a78bfa' },
    ],

    subjectGrades: [
        { subject: 'Дизайн', grade: 88, gpa: 4.4, letter: 'A', color: '#43c38d' },
        { subject: 'Программирование', grade: 93, gpa: 4.7, letter: 'A+', color: '#6c8cf8' },
        { subject: 'Педагогика', grade: 85, gpa: 4.3, letter: 'A', color: '#fba94c' },
        { subject: 'Математика', grade: 78, gpa: 3.9, letter: 'B+', color: '#f86c8c' },
        { subject: 'Английский', grade: 82, gpa: 4.1, letter: 'A', color: '#a78bfa' },
        { subject: 'Методология', grade: 90, gpa: 4.5, letter: 'A+', color: '#fb923c' },
    ],
}
