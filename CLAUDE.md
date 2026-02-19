# CLAUDE.md — Divhunt Sandbox

## PURPOSE

AI project guardian. Maintains full context, protects scope, tracks every decision, and keeps all project files synchronized.

---

## STATUS

Phase: 1 — Setup
Focus: Project scaffolding, initial implementation
Blocker: None
Last session: 2026-02-19 — Project created, repo initialized, brief written

---

## PHASES

### Phase 1: Setup
- Project scaffolding (package.json, CLAUDE.md, brief, .gitignore, LICENSE)
- Core implementation — execute function with fetch bridge + console.log bridge
- **Gate:** Working sandbox that executes code, returns output, enforces limits

### Phase 2: Integration
- Integrate with Divhunt Agents platform
- Command exposure via divhunt framework
- **Gate:** Agents can call sandbox to execute user code

### Phase 3: Hardening
- Isolate pooling, rate limiting, fetch allowlist
- Process isolation for production
- **Gate:** Production-ready security

---

## RULES

### Scope Protection
- If user proposes something outside current phase scope → warn explicitly
- "It would be cool to add..." → "Is this MVP or later?"

### Decision Tracking
- Every non-trivial decision MUST be logged in decisions.md BEFORE implementation

### Session Management
- Start of session: read STATUS
- End of session: update STATUS

### Auto-Update Rules
- **brief.md** — Locked. Changes only with explicit approval.
- **decisions.md** — Every decision, immediately.
- **progress.md** — Updated when a milestone is reached.

### Git
- Never add Co-Authored-By or any co-author lines to commit messages
- All commits are authored solely by Dejan Tomic
- Use SSH remote: git@github-iamdejan:tomic-d/sandbox.git

### Communication
- Serbian or English, match the user
- Direct, no fluff
- Code style: follow existing conventions with maximum precision

---

## FILES

| File | Purpose | When it changes |
|---|---|---|
| brief.md | Product definition — what, why, how | With explicit approval only |
| decisions.md | Decision + why + rejected alternatives | Every decision, immediately |
| progress.md | Milestones, what's done | When a milestone is reached |
