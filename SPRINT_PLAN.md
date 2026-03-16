# Verdant Echo — Detailed 6-Stage Delivery Blueprint (Agent-First Execution)

This document is the canonical execution plan for your agent team.

It is intentionally strict: **core functionality ships first**, while side systems and minigames are deferred until foundational loops are stable, persistent, and testable.

---

## 0) Delivery Philosophy and Non-Negotiables

### Primary Product Goal
Deliver a fully functional mobile-web farming RPG where a player can:
- start a new save,
- progress through days/seasons,
- build farm wealth through multiple loops,
- unlock long-term goals,
- and safely save/load across sessions.

### Non-Negotiable Build Order
1. **Core infrastructure and persistence**
2. **Farm loop + economy loop**
3. **World simulation + social loop**
4. **Adventure loops (mining/combat first)**
5. **Minigames and advanced side loops**
6. **Meta progression completion + production hardening**

> Rule: If a task does not increase playable progression reliability, it does not outrank core blockers.

### Anti-Drift Rules (Prevents “wind-on-plant before game works”)
Before Stage 5, agents must not spend sprint capacity on:
- cosmetic-only animation polish,
- decorative VFX,
- optional minigame depth,
- non-essential UI beautification,
- soundtrack layering beyond placeholder routing.

Before Stage 4 completion, agents must not build feature-rich minigames (advanced fishing variants, festival minigame branches, arcade content).

### Definition of Done (Per Task)
A task is done only when all apply:
1. Runtime behavior implemented.
2. State updated correctly (Redux).
3. Persistence behavior defined (if persistent).
4. UI/input wiring done.
5. Deterministic test/check exists.
6. No regressions in stage smoke checks.

---

## 1) Repository-Grounded System Baseline (Use Existing Codepaths)

Use existing project structure as the base for staged execution:

- **Scenes**: `src/scenes/BootScene.ts`, `src/scenes/PreloadScene.ts`, `src/scenes/FarmScene.ts`
- **Time**: `src/systems/timeSystem.js`
- **State**: `src/state/store.ts`, `src/state/slices/*`, `src/state/types.ts`, `src/state/*Schema.ts`
- **Save**: `src/storage/saveService.ts`, `src/storage/dexie.ts`, `src/lib/dexie.ts`
- **Data**: `src/data/crops.json`, `src/data/seasons.json`
- **Entry/bootstrapping**: `src/main.ts`, `src/index.html`
- **Build workflow**: `npm run dev`, `npm run build`, `npm run preview`

### Implementation Principle
Do not build duplicate systems. Extend these paths.
- If time exists in `timeSystem.js`, evolve it; don’t create a second timer.
- If save service exists, migrate it; don’t add disconnected save utilities.
- If slices exist, normalize and repair them before adding net-new state trees.

### Required Early Refactor (Stage 1 priority)
Current baseline has structural/type issues. Fix them before feature expansion:
- normalize TypeScript typing across slices,
- remove circular store dispatch patterns from reducers,
- split invalid combined slice code in `src/state/store.ts` into dedicated files,
- fix module import/export mismatches (scene modules, `pako`, `dexie`, `phaser`).

---

## 2) Team Operating Model (Agents and Workflow)

### Recommended Agent Roles
1. **Architecture Agent**: scene lifecycle, state contracts, save schema/migrations.
2. **Simulation Agent**: time/day/season/weather growth formulas.
3. **Gameplay Agent**: interactions, tools, mining/combat, controls.
4. **Content Agent**: crops/fish/NPC/festival/building datasets.
5. **UI/UX Agent**: mobile controls, HUD, menus, journal/accessibility.
6. **QA Agent**: deterministic tests, smoke suites, regression enforcement.

### Pull Request Contract (Mandatory)
Every PR must include:
- Current stage and sub-stage (e.g., Stage 2.3).
- Which exit criterion it advances.
- What state keys changed.
- Save impact (none / backward-compatible / migration required).
- Validation evidence.

### Sprint Rhythm
- **Day 1**: spec lock for stage/substage.
- **Day 2-4**: implementation.
- **Day 5**: integration + bugfix + validation.
- **Gate Review**: go/no-go vs stage exit criteria.

### Blocker Policy
If blocked >2 hours:
1. Log blocker.
2. Propose 2 fallback paths.
3. Pick lower-risk path that still advances exit criteria.
4. Continue; do not stall stage.

---

## 3) Stage 1 — Engine Integrity + Save-Safe Vertical Slice

## Objective
Make one complete, stable loop playable and persistent:
**till → plant → water → sleep → grow → harvest → ship → earn → reload successfully**.

### Why this must come first
Without this vertical slice, every future feature risks becoming an isolated prototype.

## Stage 1 Sub-Stages

### 1.1 Runtime and type integrity
Deliverables:
- Resolve compile blockers and dependency wiring.
- Ensure scene classes export/import cleanly.
- Ensure Redux store composes valid slices with typed RootState.
- Remove illegal reducer-side dispatch/store access patterns.

Checks:
- `npm run build` succeeds.
- App boots into Farm scene without runtime exceptions.

### 1.2 Time/day loop hardening
Deliverables:
- Deterministic tick system (10-minute increments).
- Valid day boundaries (6:00 to 2:00 behavior).
- Sleep transition, pass-out fallback, daily reset hook interface.

Checks:
- Tick simulation test validates day/hour rollover and season day progression rules.

### 1.3 Farm tile interaction baseline
Deliverables:
- Tile state machine for `untilled -> tilled -> watered -> planted -> growing -> harvestable`.
- Input routing for tool use + tile targeting.
- Seed consumption and crop instance creation.

Checks:
- Automated reducer/state transition tests for tile lifecycle.

### 1.4 Shipping and money loop
Deliverables:
- Shipping bin inventory intake.
- End-of-day valuation.
- Money update + daily report payload.

Checks:
- Selling same item twice exploit prevented.
- Quality multiplier hooks supported (placeholder values acceptable in Stage 1).

### 1.5 Save/load slot integrity
Deliverables:
- Save slot create/load/delete.
- Auto-save on sleep.
- Guarded load behavior for null/corrupt payloads.
- Save metadata with version + timestamp.

Checks:
- Reload mid-day restores tiles/time/inventory.
- Reload post-sleep restores day advancement + earnings.

### 1.6 Mobile-first baseline controls
Deliverables:
- Tap interaction and one movement mode.
- Minimum viable HUD (time/day/money/stamina).

Checks:
- Tested on mobile viewport emulation for tap target reliability.

## Stage 1 Exit Criteria
All true:
- One full crop cycle works end-to-end on a fresh save.
- Save/load proven across refresh and day boundary.
- No P0/P1 defects in farm loop.

---

## 4) Stage 2 — Farming as a Full Progression System (No Side-Loop Scope Creep)

## Objective
Make farming alone deep enough to sustain meaningful progression through a full season.

## Stage 2 Sub-Stages

### 2.1 Calendar and season engine
Deliverables:
- 4 seasons x 28 days.
- Season rollover with crop survival/death rules.
- Multi-season crop exceptions.

Checks:
- Simulate 120 in-game days and verify season transitions.

### 2.2 Weather v1
Deliverables:
- Seeded weather generation per day.
- Rain auto-water behavior.
- Storm state for future lightning systems.

Checks:
- Determinism test from known seed sequence.

### 2.3 Crop growth and yield depth
Deliverables:
- Per-crop growth days and regrow timers.
- Seasonal constraints and invalid planting prevention.
- Quality roll integration (normal/silver/gold/iridium) tied to farming level.

Checks:
- Growth curve simulation per crop archetype (single harvest + regrow).

### 2.4 Farming economy loop
Deliverables:
- Seed purchasing flow and shop transactions.
- Shipping valuation with quality multipliers.
- Inventory stack logic with overflow behavior.

Checks:
- Economy exploit test set (duplication, negative values, overflows).

### 2.5 Tool progression v1
Deliverables:
- Hoe/watering can tiered area behavior.
- Tool upgrade state in persistent store.

Checks:
- Tool tier action map test (tile counts + energy costs).

### 2.6 Farming crafting baseline
Deliverables:
- Chest, sprinkler, scarecrow, furnace implementation.
- Placement rules and persistence.

Checks:
- Placement collisions + save/load restoration tests.

### 2.7 Farming skill progression
Deliverables:
- XP sources, level progression 1–10.
- Unlock hooks for recipes/effects.

Checks:
- XP curve test from synthetic harvest events.

## Stage 2 Exit Criteria
All true:
- Entire season is playable with farming as primary income.
- Farming progression decisions matter (tool/skill/crafting impact).
- No data corruption on season transition.

---

## 5) Stage 3 — Living Town and Social Progression Core

## Objective
Add living-world functionality that creates purpose beyond farming: NPC schedules, relationships, and quest motivations.

## Stage 3 Sub-Stages

### 3.1 World navigation layer
Deliverables:
- Farm <-> Town scene transitions.
- Spawn points and transition-safe state handoff.

Checks:
- Transition soak test over 50 repeated scene swaps.

### 3.2 NPC schedule engine
Deliverables:
- 12 NPC definitions.
- Time/season/weather condition routing.
- Fallback behavior when destinations blocked.

Checks:
- 7-day simulation for all NPCs with no dead-end states.

### 3.3 Dialogue framework
Deliverables:
- Contextual dialogue selection by time/season/heart band.
- Talked-today gating.

Checks:
- Dialogue selection test matrix per NPC with fallback lines.

### 3.4 Gift and relationship system
Deliverables:
- Preferences (love/like/hate/dislike/neutral).
- Weekly gift limit, birthday multiplier.
- Heart conversion and status progression.

Checks:
- Relationship math tests for all preference categories.

### 3.5 Quest system v1
Deliverables:
- Help Wanted quest generation/expiration/reward.
- Journal entries and completion states.

Checks:
- Expiration and completion race-condition tests.

### 3.6 Festival framework foundation
Deliverables:
- Calendar event override framework.
- One full festival implemented as template.

Checks:
- Festival-day override test (schedule interruption + return to normal next day).

## Stage 3 Exit Criteria
All true:
- Town feels alive via schedule consistency.
- Relationships progress through daily actions and gifts.
- Quests and at least one festival run end-to-end.

---

## 6) Stage 4 — Adventure Core (Mining + Combat) Before Advanced Minigames

## Objective
Deliver alternate progression paths with reliable risk/reward systems.

> Priority within Stage 4: **Mining + Combat first**, then basic fishing, then optional minigame depth later.

## Stage 4 Sub-Stages

### 4.1 Mine structure and floor persistence
Deliverables:
- 120-floor progression model with biome bands.
- Seeded floor generation and revisit persistence.
- Elevator unlock checkpoints.

Checks:
- Revisit determinism tests for generated floors.

### 4.2 Node/resource extraction
Deliverables:
- Stone/ore/geode nodes.
- Tool gating and drop tables by floor band.

Checks:
- Drop distribution sanity checks (long-run simulation).

### 4.3 Combat baseline
Deliverables:
- Damage, collision, i-frames, knockback.
- Enemy archetypes: slime + flyer + ranged caster.
- KO/pass-out penalties and return flow.

Checks:
- TTK and survivability tests for early/mid-floor ranges.

### 4.4 Adventure skill/profession framework
Deliverables:
- Mining, combat, foraging, fishing XP events.
- Level 5/10 profession branches with actual modifiers.

Checks:
- Profession effect validation tests (value deltas apply correctly).

### 4.5 Fishing (basic loop only)
Deliverables:
- Minimal cast/hook/catch flow.
- Seasonal/location availability table integration.

Checks:
- Catch eligibility matrix test (time/season/location/weather).

### 4.6 Processing crafting (artisan/refining v1)
Deliverables:
- Keg, preserves jar, mayo, cheese press, recycling machine.
- Offline-safe timers and completion retrieval.

Checks:
- Timer continuity tests over save/load/background cycles.

## Stage 4 Exit Criteria
All true:
- Mining/combat provide viable income/progression.
- Fishing basic loop works but remains intentionally shallow.
- Profession choices produce measurable strategy differences.

---

## 7) Stage 5 — Meta Progression, Long-Term Systems, and Full Content Integration

## Objective
Complete deep progression arcs: buildings, animals, bundles, regions, full festivals, marriage.

## Stage 5 Sub-Stages

### 5.1 Building placement and construction lifecycle
Deliverables:
- Placement preview, tile legality checks, occupancy conflicts.
- Build queue/timer completion pipeline.

Checks:
- Invalid placement matrix and reload persistence tests.

### 5.2 Animal systems
Deliverables:
- Animal purchase, housing capacity, feeding/happiness.
- Product generation rules and quality effects.

Checks:
- Multi-day simulation for animal output cadence by happiness.

### 5.3 House upgrades + relationship milestones
Deliverables:
- Upgrade chain unlock effects.
- Dating/engagement/marriage state machine.

Checks:
- Relationship gating tests across heart thresholds.

### 5.4 Community Center and room rewards
Deliverables:
- Bundle submission UI/state.
- Room completion rewards and world unlock hooks.

Checks:
- One-time unlock guarantee tests (no duplicate reward grants).

### 5.5 World unlock regions
Deliverables:
- Secret Woods, Sewers, Desert access gates.
- Condition checks (tools, museum threshold, bus repair).

Checks:
- Access gating tests for pre/post unlock states.

### 5.6 Festival full pass
Deliverables:
- All listed festivals with core interaction + reward outcomes.

Checks:
- Calendar correctness over full-year simulation.

### 5.7 Optional minigame expansion (now allowed)
Deliverables:
- Expand fishing minigame depth.
- Add festival minigame variants and reward balancing.

Checks:
- Minigame reward exploit/balance checks.

## Stage 5 Exit Criteria
All true:
- Full-year progression loop is feature-complete.
- Long-term goals and unlock arcs are operational.
- Side/minigame systems exist but do not destabilize core loops.

---

## 8) Stage 6 — Production Hardening, Balancing, Accessibility, Release Gates

## Objective
Turn feature-complete game into reliable release candidate.

## Stage 6 Sub-Stages

### 6.1 Save resilience and migrations
Deliverables:
- Schema migration framework.
- Corrupt-save detection and recovery UX.
- Export/import compatibility checks.

Checks:
- Migration test suite across representative old save versions.

### 6.2 Mobile performance hardening
Deliverables:
- FPS and memory budgets.
- Scene transition optimization and asset load tuning.

Checks:
- Device profile benchmarks (low/mid/high).

### 6.3 Accessibility completion
Deliverables:
- Text scaling, colorblind modes, screen shake toggle.
- Reliable pause/resume on app background/foreground.

Checks:
- Accessibility option persistence tests.

### 6.4 Audio completion
Deliverables:
- Season/location/daypart music switching.
- Per-channel volume controls and mute states.

Checks:
- Audio routing matrix test across scene/time transitions.

### 6.5 Balance pass
Deliverables:
- Economy rebalance (crop/profession/processing/mining/fishing).
- Remove degenerate strategies.

Checks:
- Telemetry-assisted simulation runs for top strategy dominance.

### 6.6 Content completeness audit
Deliverables:
- Validate all promised crops/fish/NPC prefs/buildings/professions/festivals.
- Explicit ship-blocker list for any missing promise.

Checks:
- Content checklist gates with sign-off from content + QA agents.

### 6.7 Release certification
Deliverables:
- Full smoke/regression suite.
- Crash and progression soak tests.
- Final go/no-go report.

Checks:
- New save -> Year 1 path without progression blockers.

## Stage 6 Exit Criteria (Release Gate)
Must all pass:
- No open P0/P1 defects.
- Save/load reliability proven.
- Mobile playability verified.
- Completion path stable.

---

## 9) Cross-Stage Quality Gates (Applied Every Stage)

### Gate A — Build Health
- App boots and stage smoke test passes.
- Build command status tracked.

### Gate B — Determinism
- Any seeded system must produce reproducible output from known seeds.

### Gate C — Persistence
- State changes survive save/load and scene transitions.

### Gate D — Regression
- New work must not break prior stage acceptance checks.

### Gate E — Documentation
- Updated data contracts and stage checklist entries.

---

## 10) Suggested Stage Backlog Structure (for your manager agent)

Use this uniform ticket template for every task:
1. **ID/Stage**: `S2-Weather-SeededGeneration`
2. **Problem**
3. **Outcome**
4. **Implementation files**
5. **State keys touched**
6. **Save impact**
7. **Acceptance checks**
8. **Risks and fallback**

This format keeps autonomous agents aligned and auditable.

---

## 11) Immediate Action Plan (Start Here This Week)

1. Lock Stage 1 scope and block all Stage 2+ work in your task board.
2. Create Stage 1 sub-stage tickets (1.1–1.6) exactly as written.
3. Require PR contract fields before merge.
4. Run daily integration checkpoint on the Stage 1 vertical slice.
5. Only after Stage 1 exit criteria pass, unlock Stage 2 tickets.

If you follow this order strictly, your team will stop producing disconnected detail work and instead build toward a complete, playable, shippable RPG.
