import os

css = r"""
/* ─────────────────────────────────────────────────────────────────────────
   SHELL SEARCH — improved visibility (override)
───────────────────────────────────────────────────────────────────────── */
.shell-search-form {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 8px;
    padding: 0 0.5rem;
    animation: searchExpand 0.18s ease;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}
.shell-search-input {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 0.85rem;
    padding: 0.38rem 0.4rem;
    width: 175px;
}
.shell-search-input::placeholder { color: rgba(255, 255, 255, 0.6); }
.shell-search-form .ghost-icon {
    opacity: 0.9;
}
.shell-search-form .ghost-icon:hover {
    opacity: 1;
    background: rgba(255,255,255,0.12);
}


/* ─────────────────────────────────────────────────────────────────────────
   MINI PROFILE — larger + brighter background (override)
───────────────────────────────────────────────────────────────────────── */
.mini-profile-panel {
    width: 268px;
    background: #2a3347;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 14px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99,102,241,0.2);
    z-index: 500;
    overflow: hidden;
    animation: profilePop 0.18s ease;
}
.mini-profile-top {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 1.1rem 1.1rem 0.9rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(99, 102, 241, 0.08);
}
.mini-profile-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 800;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(99,102,241,0.4);
}
.mini-profile-name {
    font-size: 0.875rem;
    font-weight: 700;
    color: #f1f5f9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.mini-profile-role {
    display: inline-block;
    font-size: 0.72rem;
    background: rgba(99, 102, 241, 0.3);
    color: #a5b4fc;
    padding: 0.08rem 0.55rem;
    border-radius: 99px;
    margin-top: 0.25rem;
}
.mini-profile-links {
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}
.mini-profile-links button {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.78);
    padding: 0.6rem 0.85rem;
    border-radius: 9px;
    cursor: pointer;
    font-size: 0.84rem;
    text-align: left;
    transition: background 0.15s, color 0.15s;
}
.mini-profile-links button:hover {
    background: rgba(255, 255, 255, 0.09);
    color: #f1f5f9;
}
.mini-profile-logout { color: #fca5a5 !important; }
.mini-profile-logout:hover { background: rgba(248,113,113,0.12) !important; }


/* ─────────────────────────────────────────────────────────────────────────
   SUPPORT MODAL  (sp-*)
───────────────────────────────────────────────────────────────────────── */
.sp-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: spFadeIn 0.2s ease;
}
@keyframes spFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}
.sp-modal {
    position: relative;
    background: #1e2535;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    width: min(500px, calc(100vw - 2rem));
    padding: 2rem;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
    animation: spSlideUp 0.22s ease;
    color: #f1f5f9;
}
@keyframes spSlideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
.sp-close {
    position: absolute;
    top: 1rem; right: 1rem;
    background: rgba(255,255,255,0.08);
    border: none;
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: rgba(255,255,255,0.6);
    transition: background 0.15s;
}
.sp-close:hover { background: rgba(255,255,255,0.15); color: #fff; }

.sp-header { text-align: center; margin-bottom: 1.5rem; }
.sp-header-icon { color: #6366f1; display: block; margin: 0 auto 0.75rem; }
.sp-title {
    font-size: 1.3rem; font-weight: 800; margin-bottom: 0.3rem; color: #f1f5f9;
}
.sp-sub { font-size: 0.85rem; color: rgba(255,255,255,0.5); }

.sp-options { display: flex; flex-direction: column; gap: 0.6rem; }
.sp-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.95rem 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    cursor: pointer;
    text-decoration: none;
    color: #f1f5f9;
    transition: background 0.18s, border-color 0.18s, transform 0.15s;
    text-align: left;
    width: 100%;
}
.sp-option:hover {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.4);
    transform: translateX(3px);
}
.sp-option-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.sp-opt-email  { background: rgba(99,102,241,0.2); color: #818cf8; }
.sp-opt-tg     { background: rgba(0,136,204,0.2);  color: #38bdf8; }
.sp-opt-ticket { background: rgba(245,158,11,0.2); color: #fbbf24; }
.sp-opt-chat   { background: rgba(16,185,129,0.2); color: #34d399; }

.sp-option-body { flex: 1; min-width: 0; }
.sp-option-title { font-size: 0.9rem; font-weight: 700; }
.sp-option-desc  { font-size: 0.78rem; color: rgba(255,255,255,0.45); margin-top: 0.1rem; }
.sp-option-arrow { color: rgba(255,255,255,0.3); flex-shrink: 0; }

/* Ticket form */
.sp-back {
    background: none; border: none; color: rgba(255,255,255,0.5);
    cursor: pointer; font-size: 0.82rem; margin-bottom: 1rem;
    padding: 0; transition: color 0.15s;
}
.sp-back:hover { color: #f1f5f9; }
.sp-form { display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1.25rem; }
.sp-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.sp-field { display: flex; flex-direction: column; gap: 0.3rem; }
.sp-field label { font-size: 0.78rem; color: rgba(255,255,255,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.sp-field input,
.sp-field textarea {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 0.6rem 0.75rem;
    color: #f1f5f9;
    font-size: 0.875rem;
    outline: none;
    resize: vertical;
    transition: border-color 0.15s;
}
.sp-field input:focus,
.sp-field textarea:focus { border-color: #6366f1; }
.sp-field input::placeholder,
.sp-field textarea::placeholder { color: rgba(255,255,255,0.25); }

.sp-btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    background: #6366f1;
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.18s;
    margin-top: 0.25rem;
}
.sp-btn-primary:hover { background: #4f46e5; }

/* Sent state */
.sp-sent { text-align: center; padding: 1.5rem 0; }
.sp-sent-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.sp-sent h3 { font-size: 1.2rem; font-weight: 800; margin-bottom: 0.4rem; }
.sp-sent p  { font-size: 0.875rem; color: rgba(255,255,255,0.55); margin-bottom: 1.5rem; }
"""

target = os.path.join(os.path.dirname(__file__), 'frontend', 'src', 'index.css')
with open(target, 'a', encoding='utf-8') as f:
    f.write('\n')
    f.write(css)

print('CSS fix appended successfully.')
