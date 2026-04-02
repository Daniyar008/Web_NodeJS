import { useState, useEffect, useCallback } from 'react'

const KEY = 'estudy-settings'

export type Theme = 'light' | 'dark' | 'system'
export type InterfaceLang = 'ru' | 'en' | 'kz'

export interface AppSettings {
    theme: Theme
    fontSize: number          // 12–20
    timezone: string
    dateFormat: string
    currency: string
    interfaceLang: InterfaceLang
}

const DEFAULTS: AppSettings = {
    theme: 'light',
    fontSize: 14,
    timezone: 'UTC+5 — Астана',
    dateFormat: 'ДД.ММ.ГГГГ',
    currency: '₸ Тенге (KZT)',
    interfaceLang: 'ru',
}

function load(): AppSettings {
    try {
        const raw = localStorage.getItem(KEY)
        if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
    } catch { /* ignore */ }
    return { ...DEFAULTS }
}

function save(s: AppSettings) {
    try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ }
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
}

function applySettings(s: AppSettings) {
    document.documentElement.setAttribute('data-theme', resolveTheme(s.theme))
    document.documentElement.style.setProperty('--font-size-base', `${s.fontSize}px`)
}

/* ── Hook ──────────────────────────────────────────────────────────────────── */
export function useSettings() {
    const [settings, setSettings] = useState<AppSettings>(load)

    // Apply on mount (restores persisted settings immediately)
    useEffect(() => {
        applySettings(settings)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const update = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => {
            const next = { ...prev, [key]: value }
            applySettings(next)
            save(next)
            return next
        })
    }, [])

    return { settings, update }
}

/* ── Standalone apply (for initial page load outside React) ─────────────── */
export function applyPersistedSettings() {
    applySettings(load())
}
