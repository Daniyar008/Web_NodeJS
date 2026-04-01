// ─── Types ────────────────────────────────────────────────────────────────────

export type ResourceType = 'link' | 'file' | 'video' | 'doc'

export type ResourceCategory = {
    id: string
    name: string
    icon: string
    color: string
    bgColor: string
}

export type ResourceItem = {
    id: string
    categoryId: string
    name: string
    url: string
    /** First two letters or emoji for favicon fallback */
    favicon: string
    faviconBg: string
    description?: string
    tags: string[]
    addedBy: string
    addedAt: string
    isPinned: boolean
    type: ResourceType
    /** For files/docs */
    fileSize?: string
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const initialCategories: ResourceCategory[] = [
    { id: 'cat_blog', name: 'Блоги', icon: '📝', color: '#6c8cf8', bgColor: '#edf0fe' },
    { id: 'cat_ill', name: 'Иллюстрации', icon: '🎨', color: '#43c38d', bgColor: '#e7f9f2' },
    { id: 'cat_typo', name: 'Типографика', icon: 'Aa', color: '#f86c8c', bgColor: '#fde8ee' },
    { id: 'cat_icon', name: 'Иконки', icon: '✦', color: '#fba94c', bgColor: '#fff4e5' },
    { id: 'cat_img', name: 'Изображения', icon: '🖼️', color: '#a78bfa', bgColor: '#f0eaff' },
    { id: 'cat_video', name: 'Видеоуроки', icon: '▶', color: '#f97316', bgColor: '#fff0e5' },
    { id: 'cat_doc', name: 'Документы', icon: '📄', color: '#64748b', bgColor: '#f1f5f9' },
]

// ─── Resources ────────────────────────────────────────────────────────────────

export const initialResources: ResourceItem[] = [
    // Blogs
    { id: 'r1', categoryId: 'cat_blog', name: 'medium.com', url: 'https://medium.com', favicon: 'M', faviconBg: '#02b875', tags: ['статьи', 'ux'], addedBy: 'Nathael Roy', addedAt: '12 марта', isPinned: true, type: 'link', description: 'Публикации по дизайну и разработке' },
    { id: 'r2', categoryId: 'cat_blog', name: 'nngroup.com', url: 'https://nngroup.com', favicon: 'N/', faviconBg: '#e00', tags: ['ux', 'research'], addedBy: 'Paris Liana', addedAt: '10 марта', isPinned: false, type: 'link', description: 'Исследования по UX от Nielsen Norman Group' },
    { id: 'r3', categoryId: 'cat_blog', name: 'uxdesign.cc', url: 'https://uxdesign.cc', favicon: '◉', faviconBg: '#1e90ff', tags: ['ux', 'дизайн'], addedBy: 'Nathael Roy', addedAt: '8 марта', isPinned: false, type: 'link' },
    { id: 'r4', categoryId: 'cat_blog', name: 'uxpin.com', url: 'https://uxpin.com', favicon: 'UP', faviconBg: '#333', tags: ['инструменты'], addedBy: 'Ellise Remmi', addedAt: '5 марта', isPinned: false, type: 'link' },
    { id: 'r5', categoryId: 'cat_blog', name: 'toptal.com', url: 'https://toptal.com', favicon: '◆', faviconBg: '#5b6fff', tags: ['фриланс'], addedBy: 'Paris Liana', addedAt: '2 марта', isPinned: false, type: 'link' },
    { id: 'r6', categoryId: 'cat_blog', name: 'uxmag.com', url: 'https://uxmag.com', favicon: 'UX', faviconBg: '#d93025', tags: ['ux', 'статьи'], addedBy: 'Nathael Roy', addedAt: '28 фев', isPinned: false, type: 'link' },
    { id: 'r7', categoryId: 'cat_blog', name: 'uxbooth.com', url: 'https://uxbooth.com', favicon: 'UX', faviconBg: '#c0392b', tags: ['ux'], addedBy: 'Ellise Remmi', addedAt: '25 фев', isPinned: false, type: 'link' },
    { id: 'r8', categoryId: 'cat_blog', name: 'prototyper.io', url: 'https://prototyper.io', favicon: '▲', faviconBg: '#2956e4', tags: ['прототипы'], addedBy: 'Nathael Roy', addedAt: '20 фев', isPinned: false, type: 'link' },

    // Illustrations
    { id: 'r9', categoryId: 'cat_ill', name: 'undraw.co', url: 'https://undraw.co', favicon: 'U', faviconBg: '#6457d4', tags: ['бесплатно', 'svg'], addedBy: 'Nathael Roy', addedAt: '15 марта', isPinned: true, type: 'link', description: 'Бесплатные SVG-иллюстрации' },
    { id: 'r10', categoryId: 'cat_ill', name: 'storyset.com', url: 'https://storyset.com', favicon: 'St', faviconBg: '#ff7043', tags: ['векторы'], addedBy: 'Paris Liana', addedAt: '12 марта', isPinned: false, type: 'link' },
    { id: 'r11', categoryId: 'cat_ill', name: 'drawkit.com', url: 'https://drawkit.com', favicon: 'DK', faviconBg: '#00b894', tags: ['пакеты'], addedBy: 'Ellise Remmi', addedAt: '8 марта', isPinned: false, type: 'link' },
    { id: 'r12', categoryId: 'cat_ill', name: 'blush.design', url: 'https://blush.design', favicon: '🌸', faviconBg: '#fd79a8', tags: ['кастомизация'], addedBy: 'Nathael Roy', addedAt: '5 марта', isPinned: false, type: 'link' },
    { id: 'r13', categoryId: 'cat_ill', name: 'humaaans.com', url: 'https://humaaans.com', favicon: 'H', faviconBg: '#e17055', tags: ['люди'], addedBy: 'Paris Liana', addedAt: '1 марта', isPinned: false, type: 'link' },

    // Typography
    { id: 'r14', categoryId: 'cat_typo', name: 'fonts.google.com', url: 'https://fonts.google.com', favicon: 'G', faviconBg: '#e94235', tags: ['шрифты', 'gfonts'], addedBy: 'Nathael Roy', addedAt: '14 марта', isPinned: true, type: 'link', description: 'Google Fonts — бесплатные шрифты' },
    { id: 'r15', categoryId: 'cat_typo', name: 'fontsquirrel.com', url: 'https://fontsquirrel.com', favicon: 'FS', faviconBg: '#27ae60', tags: ['бесплатно'], addedBy: 'Paris Liana', addedAt: '10 марта', isPinned: false, type: 'link' },
    { id: 'r16', categoryId: 'cat_typo', name: 'typewolf.com', url: 'https://typewolf.com', favicon: 'TW', faviconBg: '#2c3e50', tags: ['вдохновение'], addedBy: 'Ellise Remmi', addedAt: '6 марта', isPinned: false, type: 'link' },
    { id: 'r17', categoryId: 'cat_typo', name: 'typekit.com', url: 'https://typekit.com', favicon: 'Tk', faviconBg: '#e74c3c', tags: ['adobe'], addedBy: 'Nathael Roy', addedAt: '2 марта', isPinned: false, type: 'link' },

    // Icons
    { id: 'r18', categoryId: 'cat_icon', name: 'lucide.dev', url: 'https://lucide.dev', favicon: '✦', faviconBg: '#f97316', tags: ['иконки', 'svg'], addedBy: 'Nathael Roy', addedAt: '16 марта', isPinned: true, type: 'link', description: 'Иконки Lucide — используем в проекте' },
    { id: 'r19', categoryId: 'cat_icon', name: 'heroicons.com', url: 'https://heroicons.com', favicon: 'Hi', faviconBg: '#6366f1', tags: ['tailwind'], addedBy: 'Paris Liana', addedAt: '13 марта', isPinned: false, type: 'link' },
    { id: 'r20', categoryId: 'cat_icon', name: 'flaticon.com', url: 'https://flaticon.com', favicon: 'F', faviconBg: '#00aff0', tags: ['библиотека'], addedBy: 'Ellise Remmi', addedAt: '9 марта', isPinned: false, type: 'link' },
    { id: 'r21', categoryId: 'cat_icon', name: 'iconify.design', url: 'https://iconify.design', favicon: 'Ic', faviconBg: '#1e88e5', tags: ['унификация'], addedBy: 'Nathael Roy', addedAt: '5 марта', isPinned: false, type: 'link' },

    // Images
    { id: 'r22', categoryId: 'cat_img', name: 'unsplash.com', url: 'https://unsplash.com', favicon: 'U', faviconBg: '#111', tags: ['фото', 'бесплатно'], addedBy: 'Nathael Roy', addedAt: '17 марта', isPinned: true, type: 'link', description: 'Бесплатные высококачественные фотографии' },
    { id: 'r23', categoryId: 'cat_img', name: 'pexels.com', url: 'https://pexels.com', favicon: 'P', faviconBg: '#05a081', tags: ['фото'], addedBy: 'Paris Liana', addedAt: '14 марта', isPinned: false, type: 'link' },
    { id: 'r24', categoryId: 'cat_img', name: 'freepik.com', url: 'https://freepik.com', favicon: 'Fp', faviconBg: '#1273eb', tags: ['векторы', 'фото'], addedBy: 'Ellise Remmi', addedAt: '10 марта', isPinned: false, type: 'link' },

    // Videos
    { id: 'r25', categoryId: 'cat_video', name: 'youtube.com', url: 'https://youtube.com/@uiuxdesign', favicon: '▶', faviconBg: '#ff0000', tags: ['видео', 'ux'], addedBy: 'Nathael Roy', addedAt: '18 марта', isPinned: true, type: 'video', description: 'UX/UI каналы на YouTube' },
    { id: 'r26', categoryId: 'cat_video', name: 'skillshare.com', url: 'https://skillshare.com', favicon: 'Sk', faviconBg: '#00e676', tags: ['курсы'], addedBy: 'Paris Liana', addedAt: '15 марта', isPinned: false, type: 'video' },
    { id: 'r27', categoryId: 'cat_video', name: 'coursera.org', url: 'https://coursera.org', favicon: 'C', faviconBg: '#0056d2', tags: ['курсы'], addedBy: 'Ellise Remmi', addedAt: '11 марта', isPinned: false, type: 'video' },

    // Docs
    { id: 'r28', categoryId: 'cat_doc', name: 'Программа курса Figma', url: '#', favicon: '📄', faviconBg: '#e2e8f0', tags: ['учебный план'], addedBy: 'Учреждение', addedAt: '20 марта', isPinned: true, type: 'doc', fileSize: '2.4 MB', description: 'Официальная программа курса' },
    { id: 'r29', categoryId: 'cat_doc', name: 'Методические рекомендации', url: '#', favicon: '📋', faviconBg: '#e2e8f0', tags: ['методика'], addedBy: 'Учреждение', addedAt: '18 марта', isPinned: false, type: 'doc', fileSize: '1.1 MB' },
    { id: 'r30', categoryId: 'cat_doc', name: 'Шаблон отчёта', url: '#', favicon: '📊', faviconBg: '#e2e8f0', tags: ['шаблон'], addedBy: 'Nathael Roy', addedAt: '14 марта', isPinned: false, type: 'doc', fileSize: '540 KB' },
]
