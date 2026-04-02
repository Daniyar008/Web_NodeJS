import { useEffect, useState } from 'react'
import { student } from './api'

const XP_KEY = 'estudy-xp'
const XP_PER_LEVEL = 100 // match backend: Math.floor(xp / 100) + 1

const LEVEL_TITLES = [
    '', 'Новичок', 'Ученик', 'Студент', 'Практик', 'Знаток',
    'Эксперт', 'Мастер', 'Профессор', 'Гений', 'Легенда',
]

function getTitle(level: number): string {
    return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)] ?? 'Легенда'
}

export function useXP() {
    const [xp, setXP] = useState<number>(() => {
        try { return parseInt(localStorage.getItem(XP_KEY) ?? '0', 10) || 0 }
        catch { return 0 }
    })
    const [justLeveledUp, setJustLeveledUp] = useState(false)

    // Sync from backend on mount
    useEffect(() => {
        const token = localStorage.getItem('estudy-access')
        if (!token) return
        student.me().then(data => {
            const backendXP = data?.gamification?.xp ?? 0
            setXP(prev => {
                if (backendXP !== prev) {
                    const prevLevel = Math.floor(prev / XP_PER_LEVEL) + 1
                    const nextLevel = Math.floor(backendXP / XP_PER_LEVEL) + 1
                    if (nextLevel > prevLevel) setJustLeveledUp(true)
                    try { localStorage.setItem(XP_KEY, String(backendXP)) } catch { /* ignore */ }
                }
                return backendXP
            })
        }).catch(() => { /* offline — use cached value */ })
    }, [])

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
