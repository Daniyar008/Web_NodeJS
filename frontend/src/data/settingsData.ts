// ─── Types ──────────────────────────────────────────────────────────────────

export type SettingsSection =
    | 'general'
    | 'profile'
    | 'email'
    | 'subscription'
    | 'payment'
    | 'reminder'

export interface NotificationToggle {
    id: string
    label: string
    description?: string
    value: boolean
}

export interface PaymentMethod {
    id: string
    type: 'visa' | 'mastercard' | 'paypal' | 'apple'
    last4?: string
    expiry?: string
    email?: string
    isDefault: boolean
}

export interface Transaction {
    id: string
    date: string
    description: string
    amount: string
    status: 'paid' | 'pending' | 'failed'
}

export interface ReminderDay {
    id: string
    label: string
    short: string
    enabled: boolean
}

// ─── Initial state ──────────────────────────────────────────────────────────

export const initialEmailToggles: NotificationToggle[] = [
    {
        id: 'promo',
        label: 'Акции и рекомендации курсов',
        description: 'Персональные подборки и скидки',
        value: true,
    },
    {
        id: 'no_promo',
        label: 'Не отправлять рекламные письма',
        description: 'Отписаться от всех промо-рассылок',
        value: false,
    },
    {
        id: 'instructor',
        label: 'Объявления от преподавателей',
        description: 'Новости курсов, на которые вы записаны',
        value: true,
    },
    {
        id: 'exam',
        label: 'Уведомления об экзаменах',
        description: 'Напоминания перед тестами и зачётами',
        value: true,
    },
    {
        id: 'certificate',
        label: 'Выдача сертификата',
        description: 'Когда курс пройден и сертификат готов',
        value: true,
    },
    {
        id: 'weekly',
        label: 'Еженедельный дайджест',
        description: 'Итоги недели и советы по учёбе',
        value: false,
    },
]

export const initialPushToggles: NotificationToggle[] = [
    {
        id: 'push_new_lesson',
        label: 'Новый урок доступен',
        value: true,
    },
    {
        id: 'push_reply',
        label: 'Ответ на мой комментарий',
        value: true,
    },
    {
        id: 'push_achievement',
        label: 'Получена ачивка',
        value: true,
    },
    {
        id: 'push_reminder',
        label: 'Напоминание об учёбе',
        value: false,
    },
]

export const initialPaymentMethods: PaymentMethod[] = [
    {
        id: 'pm1',
        type: 'visa',
        last4: '4242',
        expiry: '09/27',
        isDefault: true,
    },
    {
        id: 'pm2',
        type: 'mastercard',
        last4: '8821',
        expiry: '03/26',
        isDefault: false,
    },
    {
        id: 'pm3',
        type: 'paypal',
        email: 'user@example.com',
        isDefault: false,
    },
]

export const initialTransactions: Transaction[] = [
    {
        id: 't1',
        date: '01 апр 2026',
        description: 'Estudy Pro — месячная подписка',
        amount: '₸ 4 900',
        status: 'paid',
    },
    {
        id: 't2',
        date: '01 мар 2026',
        description: 'Estudy Pro — месячная подписка',
        amount: '₸ 4 900',
        status: 'paid',
    },
    {
        id: 't3',
        date: '01 фев 2026',
        description: 'Estudy Pro — месячная подписка',
        amount: '₸ 4 900',
        status: 'paid',
    },
    {
        id: 't4',
        date: '15 янв 2026',
        description: 'Курс "UI/UX Design Advanced"',
        amount: '₸ 12 000',
        status: 'paid',
    },
    {
        id: 't5',
        date: '02 янв 2026',
        description: 'Пополнение баланса',
        amount: '₸ 20 000',
        status: 'paid',
    },
]

export const initialReminderDays: ReminderDay[] = [
    { id: 'mon', label: 'Понедельник', short: 'Пн', enabled: true },
    { id: 'tue', label: 'Вторник', short: 'Вт', enabled: true },
    { id: 'wed', label: 'Среда', short: 'Ср', enabled: true },
    { id: 'thu', label: 'Четверг', short: 'Чт', enabled: true },
    { id: 'fri', label: 'Пятница', short: 'Пт', enabled: true },
    { id: 'sat', label: 'Суббота', short: 'Сб', enabled: false },
    { id: 'sun', label: 'Воскресенье', short: 'Вс', enabled: false },
]
