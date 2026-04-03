css = r"""

/* =======================================================================
   ABOUT PAGE  (ab-*)
   Cinematic dark style
======================================================================= */

.ab-root {
  font-family: var(--font-main, 'Nunito', sans-serif);
  background: #07090f;
  color: #e8eaed;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Section label */
.ab-section-label {
  display: block;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 4px;
  color: rgba(255,255,255,.35);
  text-transform: uppercase;
  margin-bottom: 12px;
}
.ab-section-label.inline { display: inline-block; text-align: left; }

/* HERO */
.ab-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.ab-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 60% at 20% 30%, #1a1040 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 70%, #0d1f1a 0%, transparent 60%),
    #07090f;
}
.ab-hero-particles { position: absolute; inset: 0; pointer-events: none; }
.ab-particle {
  position: absolute;
  background: rgba(255,255,255,.6);
  border-radius: 50%;
  animation: ab-twinkle linear infinite;
}
@keyframes ab-twinkle {
  0%, 100% { opacity: .7; transform: scale(1); }
  50% { opacity: .1; transform: scale(.5); }
}
.ab-hero-glow-left {
  position: absolute;
  left: -100px; top: 20%;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(99,102,241,.18) 0%, transparent 70%);
  pointer-events: none;
}
.ab-hero-glow-right {
  position: absolute;
  right: -80px; bottom: 10%;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(67,195,141,.12) 0%, transparent 70%);
  pointer-events: none;
}

/* Nav */
.ab-nav {
  position: absolute;
  top: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  z-index: 20;
}
.ab-nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
}
.ab-nav-links {
  display: flex;
  gap: 32px;
}
.ab-nav-links button {
  background: none;
  border: none;
  color: rgba(255,255,255,.65);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: color .15s;
}
.ab-nav-links button:hover { color: #fff; }
.ab-nav-active { color: #fff !important; }
.ab-nav-cta {
  padding: 9px 22px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,.3);
  background: rgba(255,255,255,.06);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background .15s, border-color .15s;
}
.ab-nav-cta:hover { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.5); }

/* Hero content */
.ab-hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 0 32px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .9s ease, transform .9s ease;
}
.ab-hero-content.visible { opacity: 1; transform: translateY(0); }
.ab-hero-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  color: rgba(255,255,255,.45);
  text-transform: uppercase;
  margin: 0 0 16px;
}
.ab-hero-title {
  font-size: clamp(72px, 12vw, 140px);
  font-weight: 900;
  color: #fff;
  margin: 0;
  line-height: .9;
  letter-spacing: -4px;
  text-shadow: 0 0 80px rgba(99,102,241,.25), 0 0 30px rgba(255,255,255,.08);
}
.ab-hero-sub {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 6px;
  color: rgba(255,255,255,.35);
  margin: 18px 0 16px;
  text-transform: uppercase;
}
.ab-hero-desc {
  font-size: 16px;
  color: rgba(255,255,255,.55);
  line-height: 1.7;
  margin: 0 0 36px;
}
.ab-hero-ctas { display: flex; gap: 16px; justify-content: center; }
.ab-hero-btn-primary {
  padding: 14px 36px;
  border-radius: 4px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
  transition: transform .15s, box-shadow .15s;
}
.ab-hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,.45); }
.ab-hero-btn-secondary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 28px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,.2);
  background: transparent;
  color: rgba(255,255,255,.8);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: border-color .15s, background .15s;
}
.ab-hero-btn-secondary:hover { border-color: rgba(255,255,255,.5); background: rgba(255,255,255,.05); }

/* Hero stats */
.ab-hero-stats {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 6px;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  z-index: 10;
}
.ab-hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 28px;
  gap: 2px;
}
.ab-hero-stat strong { font-size: 22px; font-weight: 800; color: #fff; }
.ab-hero-stat span { font-size: 11px; color: rgba(255,255,255,.4); letter-spacing: 1px; }
.ab-hero-stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,.1); }

/* Scroll hint */
.ab-hero-scroll-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(255,255,255,.25);
  z-index: 10;
  text-transform: uppercase;
}
.ab-scroll-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,.3);
  animation: ab-pulse-dot 2s ease-in-out infinite;
}
@keyframes ab-pulse-dot {
  0%,100% { transform: scale(1); opacity: .3; }
  50% { transform: scale(1.6); opacity: .7; }
}

/* TEAM SLIDER */
.ab-team {
  background: #07090f;
  padding: 60px 0 0;
}
.ab-team-main {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  min-height: 460px;
  margin: 20px 48px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.06);
  transition: background .6s ease;
}
.ab-team-info {
  padding: 52px 56px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 560px;
  z-index: 2;
  position: relative;
}
.ab-team-tag {
  display: inline-block;
  width: fit-content;
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
}
.ab-team-name {
  font-size: clamp(32px, 4vw, 54px);
  font-weight: 900;
  color: #fff;
  margin: 0;
  letter-spacing: -1px;
  line-height: 1.05;
}
.ab-team-role {
  font-size: 14px;
  color: rgba(255,255,255,.45);
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;
}
.ab-team-bio {
  font-size: 15px;
  color: rgba(255,255,255,.65);
  line-height: 1.7;
  margin: 0;
  max-width: 440px;
}
.ab-team-details {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.ab-team-details li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255,255,255,.55);
}

/* Avatar */
.ab-team-avatar-wrap {
  position: relative;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.ab-team-avatar-ring {
  position: absolute;
  width: 260px; height: 260px;
  border-radius: 50%;
  border: 1px solid;
  animation: ab-ring-spin 20s linear infinite;
}
.ab-team-ring2 {
  width: 220px; height: 220px;
  animation-direction: reverse;
  animation-duration: 15s;
}
@keyframes ab-ring-spin { to { transform: rotate(360deg); } }
.ab-team-avatar-glow {
  position: absolute;
  width: 300px; height: 300px;
  border-radius: 50%;
  animation: ab-glow-pulse 4s ease-in-out infinite;
}
@keyframes ab-glow-pulse {
  0%,100% { opacity: .5; transform: scale(1); }
  50% { opacity: .8; transform: scale(1.08); }
}
.ab-team-avatar {
  width: 180px; height: 180px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
}
.ab-team-initials { font-size: 52px; font-weight: 900; }

/* Grid arrows */
.ab-team-nav-arrows {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 56px;
  border-top: 1px solid rgba(255,255,255,.06);
}
.ab-team-arrow {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.2);
  background: rgba(255,255,255,.05);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .15s, border-color .15s;
}
.ab-team-arrow:hover { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.4); }
.ab-team-counter { font-size: 13px; color: rgba(255,255,255,.4); letter-spacing: 2px; }

/* Thumbnails */
.ab-team-thumbs {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 24px 48px;
  overflow-x: auto;
  scrollbar-width: none;
}
.ab-team-thumbs::-webkit-scrollbar { display: none; }
.ab-team-thumb {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: 2px solid rgba(255,255,255,.1);
  border-radius: 10px;
  padding: 4px;
  cursor: pointer;
  transition: border-color .2s, box-shadow .2s, transform .15s;
  flex-shrink: 0;
}
.ab-team-thumb:hover { transform: translateY(-2px); }
.ab-team-thumb.active { transform: translateY(-3px); }
.ab-thumb-inner {
  width: 64px; height: 64px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ab-thumb-name {
  font-size: 10px;
  color: rgba(255,255,255,.5);
  font-weight: 600;
  letter-spacing: .5px;
  padding-bottom: 2px;
}

/* PLANS */
.ab-plans {
  position: relative;
  padding: 80px 48px;
  overflow: hidden;
}
.ab-plans-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 50%, #12102a 0%, #07090f 70%);
}
.ab-plans-title-row {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}
.ab-plans-divider {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
}
.ab-plans-heading {
  font-size: 42px;
  font-weight: 900;
  color: #fff;
  margin: 0;
  letter-spacing: 4px;
  white-space: nowrap;
}
.ab-plans-sub {
  position: relative;
  z-index: 2;
  text-align: center;
  font-size: 14px;
  color: rgba(255,255,255,.4);
  margin: 0 0 40px;
  letter-spacing: 1px;
}
.ab-plans-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
}
.ab-plan-card {
  position: relative;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform .2s, box-shadow .2s;
  background: rgba(255,255,255,.02);
}
.ab-plan-card:hover { transform: translateY(-4px); }
.ab-plan-card.featured {
  border-color: rgba(168,85,247,.4);
  box-shadow: 0 0 0 1px rgba(168,85,247,.2), 0 20px 60px rgba(168,85,247,.15);
  transform: translateY(-6px);
}
.ab-plan-badge {
  position: absolute;
  top: 12px; right: 12px;
  padding: 3px 10px;
  border-radius: 20px;
  background: #a855f7;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
  z-index: 3;
}
.ab-plan-art {
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.ab-plan-art-logo {
  display: flex;
  align-items: center;
  gap: 6px;
  position: absolute;
  top: 16px;
  left: 20px;
}
.ab-plan-art-logo span { font-size: 10px; font-weight: 800; letter-spacing: 2px; }
.ab-plan-art-name {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 3px;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
}
.ab-plan-art-sub {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
}
.ab-plan-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;
}
.ab-plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.ab-plan-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255,255,255,.65);
}
.ab-plan-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,.07);
}
.ab-plan-price { font-size: 17px; font-weight: 800; color: #fff; }
.ab-plan-btn {
  padding: 9px 20px;
  border-radius: 5px;
  border: 1px solid;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: opacity .15s, transform .15s;
}
.ab-plan-btn:hover { opacity: .85; transform: translateY(-1px); }

/* AREAS */
.ab-areas {
  display: grid;
  grid-template-columns: 340px 1fr;
  min-height: 520px;
  overflow: hidden;
}
.ab-areas-left {
  background: linear-gradient(180deg, #0d0f18 0%, #07090f 100%);
  padding: 60px 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-right: 1px solid rgba(255,255,255,.05);
}
.ab-areas-heading {
  font-size: 44px;
  font-weight: 900;
  color: #fff;
  margin: 0;
  line-height: 1.05;
  letter-spacing: -1px;
}
.ab-areas-desc {
  font-size: 14px;
  color: rgba(255,255,255,.45);
  line-height: 1.7;
  margin: 0;
}
.ab-areas-arrows {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 8px;
}
.ab-area-arrow {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.04);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .15s;
}
.ab-area-arrow:disabled { opacity: .3; cursor: default; }
.ab-area-arrow:not(:disabled):hover { background: rgba(255,255,255,.1); }
.ab-area-counter { font-size: 12px; color: rgba(255,255,255,.35); letter-spacing: 2px; }
.ab-areas-view-all {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: rgba(255,255,255,.5);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 1px;
  padding: 0;
  transition: color .15s;
  margin-top: auto;
}
.ab-areas-view-all:hover { color: #fff; }
.ab-areas-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.ab-area-card {
  position: relative;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px;
  cursor: pointer;
  overflow: hidden;
  transition: filter .2s;
  border-left: 1px solid rgba(255,255,255,.04);
}
.ab-area-card:hover { filter: brightness(1.08); }
.ab-area-card:hover .ab-area-hover-overlay { opacity: 1 !important; }
.ab-area-card-top { display: flex; justify-content: flex-end; }
.ab-area-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ab-area-card-bottom { display: flex; flex-direction: column; gap: 4px; }
.ab-area-sub { font-size: 10px; color: rgba(255,255,255,.3); letter-spacing: 2px; text-transform: uppercase; margin: 0; }
.ab-area-title { font-size: 18px; font-weight: 800; color: #fff; margin: 0; }
.ab-area-courses { font-size: 11px; font-weight: 700; letter-spacing: 1px; }
.ab-area-hover-overlay {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity .3s;
  pointer-events: none;
}

/* TIMELINE */
.ab-timeline { padding: 80px 48px; background: #07090f; }
.ab-tl-title-row { display: flex; align-items: center; gap: 20px; margin-bottom: 48px; }
.ab-tl-track {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 40px;
}
.ab-tl-line {
  position: absolute;
  bottom: 11px;
  left: 10%; right: 10%;
  height: 1px;
  background: rgba(255,255,255,.1);
  z-index: 0;
}
.ab-tl-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 40px;
  z-index: 1;
  transition: transform .15s;
}
.ab-tl-node:hover { transform: translateY(-2px); }
.ab-tl-year { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.35); letter-spacing: 1px; transition: color .2s; }
.ab-tl-node.active .ab-tl-year { color: #fff; }
.ab-tl-dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,.15);
  border: 2px solid rgba(255,255,255,.2);
  transition: background .2s, border-color .2s, box-shadow .2s;
}
.ab-tl-node.active .ab-tl-dot { background: #6366f1; border-color: #6366f1; box-shadow: 0 0 12px rgba(99,102,241,.6); }
.ab-tl-detail {
  text-align: center;
  padding: 24px 40px;
  border-radius: 8px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.06);
  max-width: 640px;
  margin: 0 auto;
}
.ab-tl-event { font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 8px; }
.ab-tl-desc { font-size: 14px; color: rgba(255,255,255,.5); margin: 0; line-height: 1.6; }

/* REVIEWS */
.ab-reviews { padding: 80px 48px; background: linear-gradient(180deg, #07090f, #0d1020); }
.ab-reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 24px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}
.ab-review-card {
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 10px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform .2s, border-color .2s;
}
.ab-review-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,.14); }
.ab-review-quote { color: rgba(255,255,255,.12); }
.ab-review-text { font-size: 14px; color: rgba(255,255,255,.65); line-height: 1.7; flex: 1; font-style: italic; }
.ab-review-stars { display: flex; gap: 3px; }
.ab-review-author { display: flex; align-items: center; gap: 12px; }
.ab-review-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  color: #fff;
  flex-shrink: 0;
}
.ab-review-name { font-size: 14px; font-weight: 700; color: #fff; margin: 0; }
.ab-review-role { font-size: 12px; color: rgba(255,255,255,.4); margin: 0; }

/* CTA BANNER */
.ab-cta-banner {
  position: relative;
  padding: 100px 48px;
  overflow: hidden;
  text-align: center;
}
.ab-cta-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 80% at 50% 50%, #1a1040 0%, #07090f 70%);
}
.ab-cta-content { position: relative; z-index: 2; }
.ab-cta-title { font-size: clamp(36px, 5vw, 64px); font-weight: 900; color: #fff; margin: 0 0 16px; line-height: 1.1; letter-spacing: -1px; }
.ab-cta-sub { font-size: 16px; color: rgba(255,255,255,.5); margin: 0 0 36px auto; max-width: 560px; margin-left: auto; margin-right: auto; }
.ab-cta-btns { display: flex; gap: 16px; justify-content: center; }

/* FOOTER */
.ab-footer {
  padding: 32px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255,255,255,.06);
  background: #07090f;
}
.ab-footer-brand { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 800; letter-spacing: 2px; color: rgba(255,255,255,.7); }
.ab-footer-links { display: flex; gap: 24px; }
.ab-footer-links button {
  background: none;
  border: none;
  color: rgba(255,255,255,.4);
  font-size: 12px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color .15s;
}
.ab-footer-links button:hover { color: #fff; }
.ab-footer-copy { font-size: 12px; color: rgba(255,255,255,.25); margin: 0; }
"""

with open(
    r"f:\My_Projects\Node\docs\frontend\src\index.css", "a", encoding="utf-8"
) as f:
    f.write(css)
print("Done")
