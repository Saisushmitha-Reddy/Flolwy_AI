# ⚡ Flowly — AI Meeting Productivity Assistant

## 📹 Demo

[![Watch the demo](https://www.loom.com/share/98e10b2fc49447d3bdff4ddc0b92d923)]

![Flowly](https://img.shields.io/badge/Flowly-v1.0.0-6c63ff?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Claude](https://img.shields.io/badge/Claude%20Sonnet-AI%20Core-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Phase%201%20Live-34d399?style=flat-square)

---

## From idea to shipped product — built by an engineer, designed as a PM.

I come from engineering. I've sat in sprint planning, reviewed PRs, and shipped features. I know what a "simple frontend change" actually costs. I know why engineers push back on vague acceptance criteria. And I know the exact moment a product decision made in a meeting never makes it into the build — because no one wrote it down.

That last part is what Flowly is about.

**The problem:** After every meeting, knowledge workers spend 20–30 minutes piecing together what was discussed, what was decided, and what they're supposed to do next — across five different apps. It's not a discipline problem. It's a tooling gap.

**The product:** Flowly listens to your meeting (or processes your recording), generates a structured summary using Claude AI, extracts action items, and puts them in front of you for review before anything hits your task board. The whole loop — capture, understand, prioritize, confirm — in under 60 seconds.

**The principle it's built on:** The AI proposes. The human confirms. Every task requires your explicit approval. Flowly augments your judgment, it doesn't replace it.

---

## The 0→1 Story

This is a full product build — from problem discovery to shipped v1 — not a tutorial project.

**It started with a PRD.** Before any code, I wrote a proper product requirements document: user personas, success metrics, edge cases, a go/no-go framework, and a phase-gated roadmap. That document forced real decisions — what's in v1, what's not, and why.

**Then came the hard calls:**

*Why two capture modes?* User research revealed two distinct pain patterns. High-frequency meeting users (6–8 calls/day) need zero-friction live capture — results ready before the next call starts. Reflective workers prefer reviewing recordings before extracting tasks — they want control, not speed. A single input mode forces behavioral change on half your audience. Dual mode serves both without compromising the pipeline.

*Why the review-and-confirm step?* Because trust is the product. If Flowly ever silently adds a wrong task to your board, you stop using it. Making every task require your approval isn't friction — it's the feature that makes everything else work.

*Why no calendar sync in v1?* Integrations are only valuable after the core loop is proven. Shipping Phase 2 features before Phase 1 retention is validated is how you build the wrong thing faster. Phase 2 unlocks when 30-day retention hits 35%.

**Then it got built.** React frontend. Express backend. Anthropic Claude Sonnet for AI processing. Web Speech API for real-time mic capture. End to end, solo, from blank repo to working product.

---

## What It Does
Meeting  →  Transcript  →  AI Summary  →  Action Items  →  You confirm  →  Dashboard
**🎙 Live Mode** — Run Flowly during your meeting. Browser mic captures in real time. Summary and tasks are ready the moment you end the session — before your next call starts.

**📁 Upload Mode** — Record however you want, upload afterward. Same AI pipeline, same output, your pace.

**📋 Structured Summary** — Every meeting becomes: Key Discussion Points · Decisions Made · Open Questions.

**✅ Review & Confirm** — Every extracted task is presented for your approval. Edit, accept, or reject individually or in bulk. Nothing auto-commits.

**📊 Task Dashboard** — All confirmed tasks in one view, filterable by status and priority, with inline status updates.

---

## Roadmap — Phase-gated, not calendar-driven

| Phase | What ships | Gate to unlock |
|-------|-----------|----------------|
| ✅ **Phase 1 — Core loop** | Live capture, upload mode, AI summary, review & confirm, task dashboard | 30-day retention ≥ 35%, task confirmation rate ≥ 60% |
| 🔜 **Phase 2 — Integrations** | Native Zoom/Meet/Teams bots, Google Calendar sync, Slack & Notion export | DAU/MAU ≥ 0.4, Live Mode adoption ≥ 50% |
| 🔜 **Phase 3 — Intelligence** | Adaptive prioritization, mobile app, multilingual support | 90-day retention ≥ 25% |
| 🔜 **Phase 4 — Teams** | Shared summaries, team task assignment, enterprise SSO | Organic team usage from individual adoption |

Each phase gate exists because integrations built on an unproven foundation are waste. Retention first, features second.

---

## Running It

**Prerequisites:** Node.js 18+, Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
```bash
git clone https://github.com/Saisushmitha-Reddy/Flowly_AI.git
cd flowly
npm run install:all
cp .env.example .env        # add your ANTHROPIC_API_KEY
npm run dev
```

Open **http://localhost:5173**

> No API key? Flowly falls back to demo mode automatically — the full product flow works with realistic pre-built data.

---

## What This Shows About How I Work

**I write specs before I write code.** The PRD for this project includes user personas, competitive positioning, success metrics, edge case handling, and a go/no-go framework. Product thinking precedes build decisions — not the other way around.

**My engineering background shapes how I PM.** I scoped v1 around what was technically feasible without integrations — browser mic covers all platforms without OAuth flows, app store approvals, or platform compliance. That's not a workaround. That's constraint-led product thinking.

**I think in loops, not features.** Flowly isn't a list of features. It's a loop: capture → understand → prioritize → confirm. Every feature either closes that loop faster or it's out of scope.

**Shipping is a skill.** v1 is deliberately limited. Calendar sync, mobile, team features — real ideas, deliberately cut. Scope discipline matters more than feature count.

---

## Built by

**Sai Sushmitha Ancha** — Engineer transitioning into product, building at the intersection of AI and productivity tooling.

Coming from engineering means I've seen what actually ships versus what looks good in a PRD. I write requirements that engineers trust. I ask the technical questions that surface real constraints early. And I can prototype fast enough to validate an idea before committing a team to it.

Flowly is what that looks like in practice — a real product, built from scratch, by someone who's been on both sides of the table.

[LinkedIn](https://linkedin.com/in/saisushmithaancha) · [Portfolio](https://lead-single-34c.notion.site/Sai-Sushmitha-Ancha-Product-Portfolio-8870411a6f1f8324a979019b9de8bd2e?pvs=74) · [GitHub](https://github.com/Saisushmitha-Reddy)

---

*MIT License · v1.0.0 · April 2026*
