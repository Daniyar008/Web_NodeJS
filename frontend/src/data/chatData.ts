// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'teacher' | 'student' | 'parent' | 'institution'

export type ChatParticipant = {
    id: string
    name: string
    avatar: string
    role: UserRole
    online: boolean
}

export type ChatThread = {
    id: string
    /** 'direct' = личный диалог, 'group' = групповой чат */
    kind: 'direct' | 'group'
    /** Для direct — id собеседника; для group — undefined */
    participantId?: string
    /** Только для group */
    groupName?: string
    groupType?: 'class' | 'teachers' | 'parents' | 'institution' | 'custom'
    /** Аватары участников группы (первые 3) */
    memberAvatars?: string[]
    lastMessage: string
    time: string
    unread: number
    online?: boolean
}

export type ChatMessage = {
    id: string
    senderId: string
    senderName?: string
    senderAvatar?: string
    text: string
    time: string
    own: boolean
}

// ─── My profile (current user) ────────────────────────────────────────────────

export const ME: ChatParticipant = {
    id: 'me',
    name: 'Аликхан Д.',
    avatar: 'https://i.pravatar.cc/48?img=3',
    role: 'teacher',
    online: true,
}

// ─── Participants directory ────────────────────────────────────────────────────

export const participants: Record<string, ChatParticipant> = {
    p_teacher1: { id: 'p_teacher1', name: 'Nathael Roy', avatar: 'https://i.pravatar.cc/48?img=11', role: 'teacher', online: true },
    p_teacher2: { id: 'p_teacher2', name: 'Paris Liana', avatar: 'https://i.pravatar.cc/48?img=32', role: 'teacher', online: true },
    p_teacher3: { id: 'p_teacher3', name: 'Ellise Remmi', avatar: 'https://i.pravatar.cc/48?img=47', role: 'teacher', online: false },
    p_student1: { id: 'p_student1', name: 'Айгерим Т.', avatar: 'https://i.pravatar.cc/48?img=44', role: 'student', online: true },
    p_student2: { id: 'p_student2', name: 'Нурсултан А.', avatar: 'https://i.pravatar.cc/48?img=12', role: 'student', online: false },
    p_student3: { id: 'p_student3', name: 'Диана С.', avatar: 'https://i.pravatar.cc/48?img=49', role: 'student', online: true },
    p_parent1: { id: 'p_parent1', name: 'Светлана К.', avatar: 'https://i.pravatar.cc/48?img=45', role: 'parent', online: true },
    p_parent2: { id: 'p_parent2', name: 'Бауыржан Н.', avatar: 'https://i.pravatar.cc/48?img=8', role: 'parent', online: false },
    p_inst1: { id: 'p_inst1', name: 'Школа Аманжол', avatar: 'https://i.pravatar.cc/48?img=15', role: 'institution', online: true },
}

// ─── Threads ──────────────────────────────────────────────────────────────────

export const initialThreads: ChatThread[] = [
    // ── Direct: учитель → учитель
    { id: 't_teacher1', kind: 'direct', participantId: 'p_teacher1', lastMessage: 'Проверьте план урока', time: '10:30', unread: 2, online: true },
    { id: 't_teacher2', kind: 'direct', participantId: 'p_teacher2', lastMessage: 'Встреча в 15:00?', time: '09:50', unread: 0, online: true },
    // ── Direct: учитель → ученик
    { id: 't_student1', kind: 'direct', participantId: 'p_student1', lastMessage: 'Сдай домашнее задание', time: '11:00', unread: 1, online: true },
    { id: 't_student2', kind: 'direct', participantId: 'p_student2', lastMessage: 'Хорошо работаешь!', time: 'вчера', unread: 0, online: false },
    // ── Direct: учитель → родитель
    { id: 't_parent1', kind: 'direct', participantId: 'p_parent1', lastMessage: 'По поводу оценок дочери', time: '10:10', unread: 3, online: true },
    { id: 't_parent2', kind: 'direct', participantId: 'p_parent2', lastMessage: 'Жду ответа', time: 'пн', unread: 0, online: false },
    // ── Direct: учреждение
    { id: 't_inst1', kind: 'direct', participantId: 'p_inst1', lastMessage: 'Отчёт за март готов', time: '08:45', unread: 1, online: true },

    // ── Группы
    {
        id: 'g_class8a',
        kind: 'group',
        groupName: '8А — Дизайн',
        groupType: 'class',
        memberAvatars: ['https://i.pravatar.cc/48?img=44', 'https://i.pravatar.cc/48?img=12', 'https://i.pravatar.cc/48?img=49'],
        lastMessage: 'Диана: всем привет!',
        time: '11:20',
        unread: 5,
    },
    {
        id: 'g_teachers',
        kind: 'group',
        groupName: 'Коллектив учителей',
        groupType: 'teachers',
        memberAvatars: ['https://i.pravatar.cc/48?img=11', 'https://i.pravatar.cc/48?img=32', 'https://i.pravatar.cc/48?img=47'],
        lastMessage: 'Nathael: Собрание в пятницу',
        time: '10:00',
        unread: 2,
    },
    {
        id: 'g_parents',
        kind: 'group',
        groupName: 'Родители 8А',
        groupType: 'parents',
        memberAvatars: ['https://i.pravatar.cc/48?img=45', 'https://i.pravatar.cc/48?img=8'],
        lastMessage: 'Светлана: Когда родительское собрание?',
        time: '09:30',
        unread: 0,
    },
    {
        id: 'g_inst',
        kind: 'group',
        groupName: 'Школьный совет',
        groupType: 'institution',
        memberAvatars: ['https://i.pravatar.cc/48?img=15', 'https://i.pravatar.cc/48?img=11'],
        lastMessage: 'Администрация: план на апрель',
        time: '08:00',
        unread: 1,
    },
]

// ─── Conversations ────────────────────────────────────────────────────────────

export const conversationData: Record<string, ChatMessage[]> = {
    t_teacher1: [
        { id: 'm1', senderId: 'p_teacher1', own: false, text: 'Привет! Проверьте, пожалуйста, план урока по Figma.', time: '10:28' },
        { id: 'm2', senderId: 'me', own: true, text: 'Хорошо, посмотрю сегодня вечером.', time: '10:30' },
    ],
    t_teacher2: [
        { id: 'm1', senderId: 'p_teacher2', own: false, text: 'Есть возможность встретиться в 15:00?', time: '09:48' },
        { id: 'm2', senderId: 'me', own: true, text: 'Да, в 15:00 подойдёт!', time: '09:50' },
    ],
    t_student1: [
        { id: 'm1', senderId: 'me', own: true, text: 'Айгерим, не забудь сдать домашнее задание по модулю 2.', time: '11:00' },
        { id: 'm2', senderId: 'p_student1', own: false, text: 'Хорошо, уже делаю!', time: '11:02' },
    ],
    t_student2: [
        { id: 'm1', senderId: 'me', own: true, text: 'Нурсултан, хорошо справился с тестом!', time: 'вчера' },
    ],
    t_parent1: [
        { id: 'm1', senderId: 'p_parent1', own: false, text: 'Добрый день! Хотела уточнить по оценкам дочери за месяц.', time: '10:08' },
        { id: 'm2', senderId: 'me', own: true, text: 'Здравствуйте! Диана прогрессирует, оценки улучшились.', time: '10:10' },
        { id: 'm3', senderId: 'p_parent1', own: false, text: 'Спасибо большое! Когда следующий урок?', time: '10:11' },
    ],
    t_parent2: [
        { id: 'm1', senderId: 'me', own: true, text: 'Бауыржан, жду вашего ответа по расписанию.', time: 'пн' },
    ],
    t_inst1: [
        { id: 'm1', senderId: 'p_inst1', own: false, text: 'Отчёт за март готов. Прошу ознакомиться.', time: '08:43' },
        { id: 'm2', senderId: 'me', own: true, text: 'Принял, изучаю.', time: '08:45' },
    ],
    g_class8a: [
        { id: 'm1', senderId: 'p_student1', senderName: 'Айгерим', senderAvatar: 'https://i.pravatar.cc/48?img=44', own: false, text: 'Всем привет! 👋', time: '11:15' },
        { id: 'm2', senderId: 'p_student2', senderName: 'Нурсултан', senderAvatar: 'https://i.pravatar.cc/48?img=12', own: false, text: 'Когда дедлайн по заданию?', time: '11:17' },
        { id: 'm3', senderId: 'me', own: true, text: 'Дедлайн — 5 апреля. Удачи всем!', time: '11:20' },
        { id: 'm4', senderId: 'p_student3', senderName: 'Диана', senderAvatar: 'https://i.pravatar.cc/48?img=49', own: false, text: 'Диана: всем привет!', time: '11:22' },
    ],
    g_teachers: [
        { id: 'm1', senderId: 'p_teacher2', senderName: 'Paris', senderAvatar: 'https://i.pravatar.cc/48?img=32', own: false, text: 'Коллеги, напоминаю о методическом дне в четверг.', time: '09:55' },
        { id: 'm2', senderId: 'p_teacher1', senderName: 'Nathael', senderAvatar: 'https://i.pravatar.cc/48?img=11', own: false, text: 'Собрание в пятницу в 14:00, не забудьте.', time: '10:00' },
        { id: 'm3', senderId: 'me', own: true, text: 'Буду!', time: '10:01' },
    ],
    g_parents: [
        { id: 'm1', senderId: 'p_parent1', senderName: 'Светлана', senderAvatar: 'https://i.pravatar.cc/48?img=45', own: false, text: 'Когда родительское собрание в этом месяце?', time: '09:28' },
        { id: 'm2', senderId: 'me', own: true, text: 'Собрание 10 апреля в 18:00. Жду всех!', time: '09:30' },
    ],
    g_inst: [
        { id: 'm1', senderId: 'p_inst1', senderName: 'Администрация', senderAvatar: 'https://i.pravatar.cc/48?img=15', own: false, text: 'Коллеги, план на апрель утверждён.', time: '07:58' },
        { id: 'm2', senderId: 'me', own: true, text: 'Принято, спасибо!', time: '08:00' },
    ],
}

