import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { CourseShellLayout } from './CourseShellLayout'

type Question = { id: number; text: string; options: string[]; correct: number }

const TEST_QUESTIONS: Question[] = [
    {
        id: 1,
        text: 'Что такое UX дизайн?',
        options: ['Визуальное оформление интерфейса', 'Целостный опыт использования продукта', 'Программирование веб-приложений', 'Управление проектами'],
        correct: 1,
    },
    {
        id: 2,
        text: 'Какой из этих инструментов используется для дизайна?',
        options: ['Figma', 'Visual Studio Code', 'Excel', 'Notepad'],
        correct: 0,
    },
    {
        id: 3,
        text: 'Какая цветовая схема чаще всего используется в современном дизайне?',
        options: ['Флуоресцентная', 'Монохроматическая или контрастная', 'Только красная', 'Только синяя'],
        correct: 1,
    },
]

export function PlacementTestPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (l: Language) => void }) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const [answers, setAnswers] = useState<number[]>(Array(TEST_QUESTIONS.length).fill(-1))
    const [submitted, setSubmitted] = useState(false)

    const currentQuestion = TEST_QUESTIONS[currentQuestionIdx]
    const correctAnswers = answers.reduce((acc, ans, idx) => ans === TEST_QUESTIONS[idx].correct ? acc + 1 : acc, 0)
    const score = Math.round((correctAnswers / TEST_QUESTIONS.length) * 100)

    const handleAnswer = (optionIdx: number) => {
        const newAnswers = [...answers]
        newAnswers[currentQuestionIdx] = optionIdx
        setAnswers(newAnswers)
    }

    const handleNext = () => {
        if (currentQuestionIdx < TEST_QUESTIONS.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1)
        }
    }

    const handleSubmit = () => {
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <CourseShellLayout language={language} onLanguageChange={onLanguageChange} title="Результаты теста" activePage="other">
                <div className="pt-root">
                    <div className="pt-result">
                        {score >= 70 ? <CheckCircle size={60} color="#10b981" /> : <AlertCircle size={60} color="#f59e0b" />}
                        <h1 className="pt-result-title">{score >= 70 ? 'Отлично!' : 'Хороший результат'}</h1>
                        <p className="pt-result-score">{score}%</p>
                        <p className="pt-result-sub">Ваш результат: {correctAnswers} из {TEST_QUESTIONS.length} правильных ответов</p>
                        <p className="pt-result-rec">
                            {score >= 70 ? 'Начните с курса Figma Basic!' : 'Рекомендуем курс Основы Дизайна'}
                        </p>
                    </div>
                </div>
            </CourseShellLayout>
        )
    }

    return (
        <CourseShellLayout language={language} onLanguageChange={onLanguageChange} title="Пробный тест" activePage="other">
            <div className="pt-root">
                <div className="pt-progress">
                    <span className="pt-progress-label">Вопрос {currentQuestionIdx + 1} из {TEST_QUESTIONS.length}</span>
                    <div className="pt-progress-bar">
                        <div className="pt-progress-fill" style={{ width: `${((currentQuestionIdx + 1) / TEST_QUESTIONS.length) * 100}%` }} />
                    </div>
                </div>

                <div className="pt-question-card">
                    <h2 className="pt-question-text">{currentQuestion.text}</h2>
                    <div className="pt-options">
                        {currentQuestion.options.map((opt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={`pt-option ${answers[currentQuestionIdx] === idx ? 'selected' : ''}`}
                                onClick={() => handleAnswer(idx)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-actions">
                    <button
                        type="button"
                        disabled={currentQuestionIdx === 0}
                        className="pt-btn secondary"
                        onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                    >
                        ← Назад
                    </button>
                    {currentQuestionIdx < TEST_QUESTIONS.length - 1 ? (
                        <button type="button" disabled={answers[currentQuestionIdx] === -1} className="pt-btn primary" onClick={handleNext}>
                            Далее →
                        </button>
                    ) : (
                        <button type="button" disabled={answers.some(a => a === -1)} className="pt-btn primary" onClick={handleSubmit}>
                            Отправить
                        </button>
                    )}
                </div>
            </div>
        </CourseShellLayout>
    )
}
