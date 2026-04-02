css = r"""

/* =======================================================================
   ABOUT PAGE — Developer Card (ab-dev-*)
======================================================================= */

.ab-dev-card {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  margin: 20px 48px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.06);
  min-height: 560px;
  transition: background .5s ease;
}

/* Photo column */
.ab-dev-photo-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px 28px;
  border-right: 1px solid rgba(255,255,255,.07);
  background: rgba(0,0,0,.18);
}
.ab-dev-photo-wrap {
  position: relative;
  width: 220px; height: 220px;
  border-radius: 16px;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ab-dev-photo-ring {
  position: absolute;
  inset: -14px;
  border-radius: 24px;
  border: 1px solid;
  animation: ab-ring-spin 20s linear infinite;
}
.ab-dev-ring2 {
  inset: -26px;
  border-radius: 32px;
  animation-direction: reverse;
  animation-duration: 28s;
}
.ab-dev-photo-glow {
  position: absolute;
  inset: -40px;
  border-radius: 50%;
  pointer-events: none;
  animation: ab-glow-pulse 4s ease-in-out infinite;
}
.ab-dev-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
  border: 3px solid;
  position: relative;
  z-index: 2;
}
.ab-dev-photo-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  border: 2px dashed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 2;
  cursor: default;
  user-select: none;
}
.ab-dev-placeholder-initials {
  font-size: 64px;
  font-weight: 900;
  line-height: 1;
}
.ab-dev-placeholder-hint {
  font-size: 11px;
  color: rgba(255,255,255,.4);
  letter-spacing: 1px;
}
.ab-dev-placeholder-hint2 {
  font-size: 9px;
  color: rgba(255,255,255,.22);
  letter-spacing: .5px;
  font-family: 'Courier New', monospace;
}
.ab-dev-photo-name-row {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ab-dev-photo-name {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: .5px;
}
.ab-dev-photo-uni {
  font-size: 11px;
  color: rgba(255,255,255,.4);
  letter-spacing: .5px;
}

/* Info column */
.ab-dev-info {
  padding: 44px 52px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
}
.ab-dev-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ab-dev-header .ab-team-details {
  margin-top: 4px;
}

/* Tech stack */
.ab-dev-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.ab-dev-stack-cat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ab-dev-cat-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
}
.ab-dev-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.ab-dev-tag {
  padding: 4px 11px;
  border-radius: 20px;
  border: 1px solid;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .3px;
  white-space: nowrap;
  transition: transform .12s;
}
.ab-dev-tag:hover { transform: translateY(-1px); }
"""

with open(
    r"f:\My_Projects\Node\docs\frontend\src\index.css", "a", encoding="utf-8"
) as f:
    f.write(css)
print("Done")
