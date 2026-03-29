import { type FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { signIn } from '../features/auth/authSlice'

type RoleOption = 'student' | 'teacher' | 'parent' | 'institution'

export function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [role, setRole] = useState<RoleOption>('student')

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // Temporary auth flow for sprint foundation before backend auth endpoints.
        dispatch(signIn({ token: 'demo-token', role }))
        navigate(`/dashboard/${role}`)
    }

    return (
        <section className="mx-auto w-full max-w-xl reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
            <h1 className="heading-font text-3xl font-bold">Вход в EduFuture</h1>
            <p className="mt-2 text-sm text-[color:var(--ink-700)]">Базовая форма для MVP. Подключим JWT из backend на следующем этапе.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm font-semibold text-[color:var(--ink-900)]">
                    Email
                    <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 outline-none transition focus:border-[color:var(--brand)]"
                    />
                </label>

                <label className="block text-sm font-semibold text-[color:var(--ink-900)]">
                    Пароль
                    <input
                        required
                        type="password"
                        placeholder="********"
                        className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 outline-none transition focus:border-[color:var(--brand)]"
                    />
                </label>

                <label className="block text-sm font-semibold text-[color:var(--ink-900)]">
                    Роль
                    <select
                        value={role}
                        onChange={(event) => setRole(event.target.value as RoleOption)}
                        className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 outline-none transition focus:border-[color:var(--brand)]"
                    >
                        <option value="student">Ученик</option>
                        <option value="teacher">Учитель</option>
                        <option value="parent">Родитель</option>
                        <option value="institution">Учреждение</option>
                    </select>
                </label>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-[color:var(--brand)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[color:var(--brand-deep)]"
                >
                    Войти
                </button>
            </form>
        </section>
    )
}
