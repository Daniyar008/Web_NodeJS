import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'nf-variant-index'
const TOTAL = 4

function readVariant(): number {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? parseInt(stored, 10) : 0
}

export function NotFoundPage() {
    // Lazy-init reads current variant WITHOUT incrementing (safe for double-render)
    const [variant] = useState<number>(readVariant)
    const navigate = useNavigate()

    useEffect(() => {
        // Write the NEXT variant so the following visit advances
        const next = (variant + 1) % TOTAL
        localStorage.setItem(STORAGE_KEY, String(next))
        // Cleanup: StrictMode unmounts immediately after first effect run, so
        // restore the current value — the second effect run will write next again
        return () => {
            localStorage.setItem(STORAGE_KEY, String(variant))
        }
    }, [variant])

    if (variant === 0) return <SpaceVariant onHome={() => navigate('/')} />
    if (variant === 1) return <GalaxyVariant onHome={() => navigate('/')} />
    if (variant === 2) return <BluRoomVariant onHome={() => navigate('/')} />
    return <NightVariant onHome={() => navigate('/')} />
}

/* ─────────────────────────────────────────────────────────────────────────
   VARIANT 0 — Deep Space (dark, astronaut, rockets, moon landscape)
───────────────────────────────────────────────────────────────────────── */
function SpaceVariant({ onHome }: { onHome: () => void }) {
    return (
        <div className="nf0-root">
            {/* Stars */}
            <div className="nf0-stars">
                {Array.from({ length: 80 }).map((_, i) => (
                    <span
                        key={i}
                        className="nf0-star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 70}%`,
                            width: `${1 + Math.random() * 2}px`,
                            height: `${1 + Math.random() * 2}px`,
                            animationDelay: `${Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Spiral rings */}
            <div className="nf0-rings">
                <div className="nf0-ring" style={{ width: 420, height: 420, opacity: 0.18 }} />
                <div className="nf0-ring" style={{ width: 320, height: 320, opacity: 0.14 }} />
                <div className="nf0-ring" style={{ width: 220, height: 220, opacity: 0.10 }} />
                <div className="nf0-ring" style={{ width: 130, height: 130, opacity: 0.07 }} />
            </div>

            {/* Moon surface bottom */}
            <div className="nf0-moon-surface">
                <div className="nf0-crater" style={{ left: '8%', bottom: 30, width: 44, height: 44 }} />
                <div className="nf0-crater" style={{ left: '20%', bottom: 10, width: 28, height: 28 }} />
                <div className="nf0-crater" style={{ left: '72%', bottom: 20, width: 52, height: 52 }} />
                <div className="nf0-crater" style={{ left: '85%', bottom: 35, width: 36, height: 36 }} />
            </div>

            {/* Moon surface top-right */}
            <div className="nf0-moon-tr" />

            {/* Rockets */}
            <div className="nf0-rocket nf0-rocket-1">🚀</div>
            <div className="nf0-rocket nf0-rocket-2">🛸</div>
            <div className="nf0-rocket nf0-rocket-3">🚀</div>

            {/* Satellite */}
            <div className="nf0-satellite">🛰️</div>

            {/* Astronaut */}
            <div className="nf0-astronaut">👨‍🚀</div>

            {/* Content */}
            <div className="nf0-content">
                <h1 className="nf0-code">404</h1>
                <p className="nf0-msg">It looks like you&apos;re lost...</p>
                <button className="nf0-btn" onClick={onHome}>GO BACK HOME</button>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────────────────
   VARIANT 1 — Purple Galaxy (gradient purple/blue, space cat, planets)
───────────────────────────────────────────────────────────────────────── */
function GalaxyVariant({ onHome }: { onHome: () => void }) {
    return (
        <div className="nf1-root">
            {/* Wavy blobs */}
            <div className="nf1-blob nf1-blob-tl" />
            <div className="nf1-blob nf1-blob-br" />

            {/* Planets */}
            <div className="nf1-planet nf1-p1">🌕</div>
            <div className="nf1-planet nf1-p2">🪐</div>
            <div className="nf1-planet nf1-p3">🔴</div>
            <div className="nf1-planet nf1-p4">⚪</div>
            <div className="nf1-planet nf1-p5">🟤</div>

            {/* Dots pattern */}
            <div className="nf1-dots" />

            {/* Big 4__4 with cat in the middle */}
            <div className="nf1-content">
                <div className="nf1-code-row">
                    <span className="nf1-digit">4</span>
                    <div className="nf1-cat-orb">
                        <span className="nf1-cat">🐱</span>
                        <div className="nf1-orb-ring" />
                    </div>
                    <span className="nf1-digit">4</span>
                </div>
                <h2 className="nf1-title">Page Not Found</h2>
                <p className="nf1-sub">Sorry, we can&apos;t find the page you&apos;re looking for.</p>
                <button className="nf1-btn" onClick={onHome}>BACK TO HOME</button>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────────────────
   VARIANT 2 — 3D Blue Room (monochromatic blue, 3D letters, hole + ladder)
───────────────────────────────────────────────────────────────────────── */
function BluRoomVariant({ onHome }: { onHome: () => void }) {
    return (
        <div className="nf2-root">
            {/* Room walls */}
            <div className="nf2-wall-left" />
            <div className="nf2-wall-right" />
            <div className="nf2-floor" />

            {/* 3D 404 */}
            <div className="nf2-content">
                <div className="nf2-four-row">
                    <div className="nf2-digit">
                        <span className="nf2-face nf2-front">4</span>
                        <span className="nf2-face nf2-bottom" />
                        <span className="nf2-face nf2-side" />
                    </div>
                    {/* Hole */}
                    <div className="nf2-hole-wrap">
                        <div className="nf2-hole">
                            <div className="nf2-hole-inner" />
                            {/* Ladder */}
                            <div className="nf2-ladder">
                                <div className="nf2-ladder-side nf2-ls-l" />
                                <div className="nf2-ladder-side nf2-ls-r" />
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div key={i} className="nf2-rung" style={{ bottom: `${14 + i * 14}%` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="nf2-digit">
                        <span className="nf2-face nf2-front">4</span>
                        <span className="nf2-face nf2-bottom" />
                        <span className="nf2-face nf2-side" />
                    </div>
                </div>

                <div className="nf2-text-block">
                    <h1 className="nf2-oops">OOPS!</h1>
                    <p className="nf2-desc">We can&apos;t find<br />the page that you&apos;re<br />looking for :(</p>
                </div>
                <button className="nf2-btn" onClick={onHome}>BACK TO HOME</button>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────────────────
   VARIANT 3 — Night Mountains (dark, moon, peaks, search bar)
───────────────────────────────────────────────────────────────────────── */
function NightVariant({ onHome }: { onHome: () => void }) {
    const [q, setQ] = useState('')
    const navigate = useNavigate()

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if (q.trim()) navigate(`/courses?q=${encodeURIComponent(q.trim())}`)
        else onHome()
    }

    return (
        <div className="nf3-root">
            {/* Stars */}
            {Array.from({ length: 60 }).map((_, i) => (
                <span
                    key={i}
                    className="nf3-star"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${5 + Math.random() * 55}%`,
                        width: `${2 + Math.random() * 3}px`,
                        height: `${2 + Math.random() * 3}px`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                />
            ))}

            {/* Moon */}
            <div className="nf3-moon" />

            {/* Floating dots */}
            <div className="nf3-dot" style={{ left: '18%', top: '22%', width: 12, height: 12 }} />
            <div className="nf3-dot" style={{ left: '42%', top: '12%', width: 8, height: 8 }} />
            <div className="nf3-dot" style={{ left: '62%', top: '18%', width: 10, height: 10 }} />
            <div className="nf3-dot" style={{ left: '80%', top: '28%', width: 14, height: 14 }} />
            <div className="nf3-dot" style={{ left: '30%', top: '38%', width: 6, height: 6 }} />

            {/* Mountain silhouettes */}
            <div className="nf3-mountains">
                <div className="nf3-mt nf3-mt-1" />
                <div className="nf3-mt nf3-mt-2" />
                <div className="nf3-mt nf3-mt-3" />
                <div className="nf3-mt nf3-mt-4" />
                <div className="nf3-mt nf3-mt-5" />
                <div className="nf3-mt nf3-mt-6" />
                <div className="nf3-mt nf3-mt-7" />
            </div>

            {/* Content */}
            <div className="nf3-content">
                <div className="nf3-split">
                    <h1 className="nf3-code">404</h1>
                    <div className="nf3-divider" />
                    <div className="nf3-right">
                        <h2 className="nf3-sorry">SORRY!</h2>
                        <p className="nf3-desc">The Page You&apos;re Looking For<br />Was Not Found</p>
                        <button className="nf3-back-link" onClick={onHome}>‹ Go Back</button>
                    </div>
                </div>
                <form className="nf3-search-form" onSubmit={handleSearch}>
                    <input
                        className="nf3-search-input"
                        placeholder="How Can We Help?"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <button type="submit" className="nf3-search-btn" aria-label="Search">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}
