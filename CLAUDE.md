# CLAUDE.md — Divhunt Sandbox

## PURPOSE

AI project guardian. Maintains full context, protects scope, tracks every decision, and keeps all project files synchronized.

---

## STATUS

Phase: 1 — Setup (nearly complete)
Focus: MVP functional, docs cleanup
Blocker: None
Last session: 2026-02-19 — Worker pool, schema validation, per-worker isolation, .env config, status endpoint, docs moved to .claude/

---

## PHASES

### Phase 1: Setup
- Project scaffolding (package.json, CLAUDE.md, brief, .gitignore, LICENSE)
- Core implementation — execute function with fetch bridge + console.log bridge
- Worker pool with per-worker QuickJS engine isolation
- Input/output schema validation (mandatory)
- HTTP API (run + status endpoints)
- .env config for worker count
- **Gate:** Working sandbox that executes code, returns output, enforces limits ✓

### Phase 2: Integration
- Integrate with Divhunt Agents platform
- Command exposure via divhunt framework
- **Gate:** Agents can call sandbox to execute user code

### Phase 3: Hardening
- Rate limiting, fetch allowlist
- Process isolation for production
- **Gate:** Production-ready security

---

## RULES

### Scope Protection
- If user proposes something outside current phase scope → warn explicitly
- "It would be cool to add..." → "Is this MVP or later?"

### Decision Tracking
- Every non-trivial decision MUST be logged in .claude/decisions.md BEFORE implementation

### Session Management
- Start of session: read STATUS
- End of session: update STATUS

### Auto-Update Rules
- **.claude/brief.md** — Locked. Changes only with explicit approval.
- **.claude/decisions.md** — Every decision, immediately.
- **.claude/progress.md** — Updated when a milestone is reached.

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
| .claude/brief.md | Product definition — what, why, how | With explicit approval only |
| .claude/decisions.md | Decision + why + rejected alternatives | Every decision, immediately |
| .claude/progress.md | Milestones, what's done | When a milestone is reached |
| .claude/README.md | Project documentation | When features change |
