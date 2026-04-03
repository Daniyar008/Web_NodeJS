import os

css = r"""
/* ─────────────────────────────────────────────────────────────────────────
   HELP PAGE  (hp-*)
───────────────────────────────────────────────────────────────────────── */
.hp-root {
    min-height: 100vh;
    background: #f8f9fb;
    color: #1a1d23;
    font-family: 'Inter', sans-serif;
}

/* Hero */
.hp-hero {
    background: linear-gradient(135deg, #1a1d23 0%, #2d3a4e 50%, #1e3a5f 100%);
    color: #fff;
    padding: 3rem 2rem 3.5rem;
    text-align: center;
    position: relative;
}
.hp-back-btn {
    position: absolute;
    top: 1.25rem;
    left: 1.5rem;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.8);
    padding: 0.35rem 0.9rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.2s;
}
.hp-back-btn:hover { background: rgba(255,255,255,0.2); }

.hp-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(99,102,241,0.25);
    border: 1px solid rgba(99,102,241,0.5);
    color: #a5b4fc;
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 99px;
    margin-bottom: 1.25rem;
}
.hp-hero-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 0.6rem;
}
.hp-hero-sub {
    color: rgba(255,255,255,0.65);
    font-size: 1.05rem;
    margin: 0 0 2rem;
}

.hp-search-form { max-width: 560px; margin: 0 auto 1.5rem; }
.hp-search-inner {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.25);
    padding: 0 1rem;
    gap: 0.5rem;
}
.hp-search-icon { color: #94a3b8; flex-shrink: 0; }
.hp-search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.95rem;
    padding: 0.85rem 0;
    background: transparent;
    color: #1a1d23;
}
.hp-search-input::placeholder { color: #94a3b8; }
.hp-search-clear {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    font-size: 0.85rem;
    padding: 0.2rem 0.4rem;
}
.hp-search-clear:hover { color: #64748b; }

.hp-quick-chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    max-width: 680px;
    margin: 0 auto;
}
.hp-chip {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.8);
    padding: 0.3rem 0.85rem;
    border-radius: 99px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
}
.hp-chip:hover { background: rgba(255,255,255,0.18); }
.hp-chip.active {
    background: #6366f1;
    border-color: #6366f1;
    color: #fff;
}

/* Two-column layout */
.hp-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 2.5rem auto;
    padding: 0 1.5rem;
}
@media (max-width: 768px) {
    .hp-layout { grid-template-columns: 1fr; }
}

/* Sidebar */
.hp-sidebar {
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
    height: fit-content;
    position: sticky;
    top: 1.5rem;
}
.hp-sidebar-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
    margin-bottom: 0.5rem;
}
.hp-cat-btn {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    color: #475569;
    padding: 0.55rem 0.7rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.15s, color 0.15s;
}
.hp-cat-btn span:first-of-type { flex: 1; }
.hp-cat-btn:hover { background: #f1f5f9; color: #1a1d23; }
.hp-cat-btn.active { background: #ede9fe; color: #6366f1; font-weight: 600; }
.hp-cat-count {
    font-size: 0.72rem;
    background: #e2e8f0;
    color: #64748b;
    padding: 0.1rem 0.45rem;
    border-radius: 99px;
}
.hp-cat-btn.active .hp-cat-count { background: #c7d2fe; color: #4338ca; }

.hp-sidebar-contact {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    margin-top: 1.25rem;
    padding: 0.9rem;
    background: #f8f9fb;
    border-radius: 10px;
    color: #6366f1;
    font-size: 0.82rem;
}
.hp-sidebar-contact > div > p { color: #475569; font-weight: 600; font-size: 0.82rem; margin-bottom: 0.2rem; }
.hp-sidebar-contact > div > button {
    background: none; border: none; color: #6366f1; cursor: pointer; font-size: 0.8rem;
    padding: 0; text-decoration: underline;
}

/* Articles */
.hp-articles { min-width: 0; }
.hp-articles-head {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
}
.hp-articles-count { font-size: 0.8rem; color: #94a3b8; }
.hp-articles-query { font-size: 0.8rem; color: #6366f1; }

.hp-articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
}
.hp-article-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: box-shadow 0.2s, transform 0.2s;
    cursor: pointer;
}
.hp-article-card:hover { box-shadow: 0 4px 20px rgba(99,102,241,0.12); transform: translateY(-2px); }
.hp-article-icon {
    width: 40px; height: 40px;
    background: #ede9fe;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #6366f1;
    flex-shrink: 0;
}
.hp-article-body { flex: 1; }
.hp-article-title { font-size: 0.9rem; font-weight: 700; color: #1a1d23; margin-bottom: 0.3rem; }
.hp-article-excerpt { font-size: 0.8rem; color: #64748b; line-height: 1.5; }
.hp-article-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.5rem;
    border-top: 1px solid #f1f5f9;
}
.hp-article-time { font-size: 0.75rem; color: #94a3b8; }
.hp-article-link {
    display: flex; align-items: center; gap: 0.3rem;
    background: none; border: none; color: #6366f1;
    font-size: 0.78rem; font-weight: 600; cursor: pointer;
    transition: gap 0.15s;
}
.hp-article-link:hover { gap: 0.5rem; }

.hp-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.75rem; padding: 4rem 1rem; color: #94a3b8; text-align: center;
}
.hp-empty p { font-size: 1.1rem; font-weight: 600; color: #64748b; }
.hp-empty span { font-size: 0.85rem; }

/* FAQ */
.hp-faq {
    background: #fff;
    border-top: 1px solid #e2e8f0;
    padding: 3.5rem 1.5rem;
}
.hp-faq-inner { max-width: 800px; margin: 0 auto; }
.hp-faq-title {
    font-size: 1.75rem; font-weight: 800; color: #1a1d23;
    margin-bottom: 0.4rem; text-align: center;
}
.hp-faq-sub {
    text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 1.75rem;
}
.hp-faq-chips {
    display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.75rem;
    justify-content: center;
}
/* reuse .hp-chip from above, but override for light bg context */
.hp-faq .hp-chip {
    background: #f1f5f9;
    border-color: #e2e8f0;
    color: #475569;
}
.hp-faq .hp-chip:hover { background: #e2e8f0; }
.hp-faq .hp-chip.active { background: #6366f1; border-color: #6366f1; color: #fff; }

.hp-faq-list { display: flex; flex-direction: column; gap: 0.75rem; }
.hp-faq-item {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    background: #f8f9fb;
    transition: border-color 0.2s;
}
.hp-faq-item.open { border-color: #a5b4fc; background: #fff; }
.hp-faq-q {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; padding: 1rem 1.25rem; background: none; border: none;
    text-align: left; font-size: 0.9rem; font-weight: 600; color: #1a1d23; cursor: pointer;
}
.hp-faq-chevron { flex-shrink: 0; color: #94a3b8; transition: transform 0.25s; }
.hp-faq-item.open .hp-faq-chevron { transform: rotate(180deg); color: #6366f1; }
.hp-faq-a {
    padding: 0 1.25rem 1rem;
    font-size: 0.875rem;
    color: #475569;
    line-height: 1.7;
    animation: faqFadeIn 0.2s ease;
}
@keyframes faqFadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* CTA */
.hp-cta {
    background: linear-gradient(135deg, #312e81 0%, #4f46e5 60%, #7c3aed 100%);
    padding: 4rem 1.5rem;
    text-align: center;
    color: #fff;
}
.hp-cta-inner { max-width: 560px; margin: 0 auto; }
.hp-cta-icon { color: #a5b4fc; margin-bottom: 1rem; display: block; margin-left: auto; margin-right: auto; }
.hp-cta-title { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; }
.hp-cta-sub { color: rgba(255,255,255,0.75); font-size: 0.95rem; margin-bottom: 2rem; }
.hp-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.hp-cta-primary {
    display: flex; align-items: center; gap: 0.5rem;
    background: #fff; color: #4f46e5; font-weight: 700;
    border: none; padding: 0.8rem 1.75rem; border-radius: 10px; cursor: pointer;
    font-size: 0.9rem; transition: opacity 0.2s;
}
.hp-cta-primary:hover { opacity: 0.9; }
.hp-cta-secondary {
    display: flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.15); color: #fff;
    border: 1px solid rgba(255,255,255,0.35); padding: 0.8rem 1.75rem;
    border-radius: 10px; cursor: pointer; font-size: 0.9rem; transition: background 0.2s;
}
.hp-cta-secondary:hover { background: rgba(255,255,255,0.25); }

/* Footer */
.hp-footer {
    background: #1a1d23; color: rgba(255,255,255,0.6);
    padding: 2rem 1.5rem;
}
.hp-footer-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
}
.hp-footer-brand { font-weight: 700; color: #fff; font-size: 1rem; }
.hp-footer-links { display: flex; gap: 1.5rem; }
.hp-footer-links button {
    background: none; border: none; color: rgba(255,255,255,0.55);
    cursor: pointer; font-size: 0.85rem; transition: color 0.2s;
}
.hp-footer-links button:hover { color: #fff; }
.hp-footer-copy { font-size: 0.8rem; }


/* ─────────────────────────────────────────────────────────────────────────
   SHELL SEARCH  (shell-search-*)
───────────────────────────────────────────────────────────────────────── */
.shell-search-wrap { position: relative; display: flex; align-items: center; }

.shell-search-form {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    padding: 0 0.4rem;
    animation: searchExpand 0.18s ease;
}
@keyframes searchExpand {
    from { opacity: 0; width: 60px; }
    to   { opacity: 1; width: auto; }
}
.shell-search-input {
    background: transparent;
    border: none;
    outline: none;
    color: inherit;
    font-size: 0.82rem;
    padding: 0.3rem 0.4rem;
    width: 160px;
}
.shell-search-input::placeholder { color: rgba(255,255,255,0.4); }


/* ─────────────────────────────────────────────────────────────────────────
   MINI PROFILE POPOVER  (mini-profile-*)
───────────────────────────────────────────────────────────────────────── */
.mini-profile-wrap { position: relative; display: inline-flex; align-items: center; }

.mini-profile-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 220px;
    background: #1f2533;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45);
    z-index: 500;
    overflow: hidden;
    animation: profilePop 0.18s ease;
}
@keyframes profilePop {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}

.mini-profile-top {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1rem 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
}
.mini-profile-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem; font-weight: 700; color: #fff;
    flex-shrink: 0;
}
.mini-profile-info { min-width: 0; }
.mini-profile-name {
    font-size: 0.82rem; font-weight: 700; color: #f1f5f9;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mini-profile-role {
    display: inline-block;
    font-size: 0.7rem;
    background: rgba(99,102,241,0.25);
    color: #a5b4fc;
    padding: 0.05rem 0.5rem;
    border-radius: 99px;
    margin-top: 0.2rem;
}

.mini-profile-links {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.mini-profile-links button {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    background: none;
    border: none;
    color: rgba(255,255,255,0.7);
    padding: 0.55rem 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.82rem;
    text-align: left;
    transition: background 0.15s, color 0.15s;
}
.mini-profile-links button:hover { background: rgba(255,255,255,0.07); color: #f1f5f9; }
.mini-profile-logout { color: #f87171 !important; }
.mini-profile-logout:hover { background: rgba(248,113,113,0.1) !important; }
"""

target = os.path.join(os.path.dirname(__file__), "frontend", "src", "index.css")
with open(target, "a", encoding="utf-8") as f:
    f.write("\n")
    f.write(css)

print("CSS appended successfully.")
