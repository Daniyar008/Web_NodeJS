import { useState } from 'react'

const XP_KEY = 'estudy-xp'
const XP_PER_LEVEL = 500

const LEVEL_TITLES = [
    '', 'Новичок', 'Ученик', 'Студент', 'Практик', 'Знаток',
    'Эксперт', 'Мастер', 'Профессор', 'Гений', 'Легенда',
]

function getTitle(level: number): string {
    return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)] ?? 'Легенда'
}

export function useXP() {
    const [xp, setXP] = useState<number>(() => {
        try { return parseInt(localStorage.getItem(XP_KEY) ?? '2740', 10) || 2740 }
        catch { return 2740 }
    })
    const [justLeveledUp, setJustLeveledUp] = useState(false)

    const level = Math.floor(xp / XP_PER_LEVEL) + 1
    const xpInLevel = xp % XP_PER_LEVEL
    const xpToNext = XP_PER_LEVEL
    const progress = Math.round((xpInLevel / xpToNext) * 100)
    const levelTitle = getTitle(level)

    const addXP = (amount: number) => {
        setXP(prev => {
            const prevLevel = Math.floor(prev / XP_PER_LEVEL) + 1
            const next = prev + amount
            const nextLevel = Math.floor(next / XP_PER_LEVEL) + 1
            if (nextLevel > prevLevel) setJustLeveledUp(true)
            try { localStorage.setItem(XP_KEY, String(next)) } catch { /* ignore */ }
            return next
        })
    }

    const clearLevelUp = () => setJustLeveledUp(false)

    return { xp, level, levelTitle, progress, xpInLevel, xpToNext, addXP, justLeveledUp, clearLevelUp }
}
