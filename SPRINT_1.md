# Sprint 1 — Engine Integrity + Save-Safe Vertical Slice

**Goal:** Make one complete, stable loop playable and persistent: **till → plant → water → sleep → grow → harvest → ship → earn → reload successfully**.

**Duration:** 1-2 weeks (adjust based on team velocity)

**Definition of Done:**
- One full crop cycle works end-to-end on a fresh save
- Save/load proven across refresh and day boundary
- No P0/P1 defects in farm loop

---

## Sprint 1.1 — Runtime and Type Integrity

### Objective
Fix all compilation errors, type mismatches, and dependency issues. The game must boot without runtime exceptions.

### Why This Matters
Without a clean build and stable runtime, every subsequent feature risks being built on quicksand. This is the foundation.

### Detailed Tasks

#### 1.1.1 — Audit and Fix TypeScript Compilation Errors
**Problem:** Current codebase has type mismatches across slices, scenes, and utilities.

**Outcome:** `npm run build` produces zero errors and zero warnings.

**Implementation Details:**
- Run `npm run build` and capture all TypeScript errors
- Fix implicit `any` types in state slices (especially `src/state/slices/`)
- Add missing return types to all functions in `src/scenes/*.ts`
- Resolve `pako`, `dexie`, and `phaser` import type declarations
- Add `// @ts-ignore` only as last resort with explanatory comment

**Files to Touch:**
- `src/state/store.ts` — Fix RootState composition
- `src/state/slices/*.ts` — Add explicit types to all reducers
- `src/scenes/*.ts` — Add return types to all methods
- `src/lib/dexie.ts` — Fix Dexie type declarations
- `tsconfig.json` — Verify strict mode is enabled

**State Keys Touched:** None (type-only changes)

**Save Impact:** None

**Acceptance Checks:**
- [ ] `npm run build` exits with code 0
- [ ] No red squiggles in VS Code across entire project
- [ ] `npm run type-check` passes (add if not exists)

**Risks and Fallback:**
- Risk: Some third-party libs lack types → Fallback: Add minimal `.d.ts` declarations

---

#### 1.1.2 — Resolve Circular Dependencies in Redux Store
**Problem:** Reducers currently dispatch to store from within reducer logic, creating circular dependencies.

**Outcome:** All Redux logic follows standard pattern: actions → reducers → store update. No reducer imports store.

**Implementation Details:**
- Identify all locations where reducers call `store.dispatch()`
- Convert these to standard action creators
- Move side effects to thunks or middleware
- Ensure `src/state/store.ts` only imports slices, not vice versa

**Files to Touch:**
- `src/state/store.ts` — Remove any reducer-side store access
- `src/state/slices/*.ts` — Remove store imports, use action creators only
- `src/state/middleware.ts` — Create if needed for side effects

**State Keys Touched:** None (architectural refactor)

**Save Impact:** None

**Acceptance Checks:**
- [ ] No file in `src/state/slices/` imports from `src/state/store.ts`
- [ ] All tests pass after refactor
- [ ] App behavior unchanged

**Risks and Fallback:**
- Risk: Breaking existing functionality → Fallback: Comprehensive test coverage before refactor

---

#### 1.1.3 — Fix Scene Module Import/Export Mismatches
**Problem:** Scene classes may have default vs named export mismatches.

**Outcome:** All scenes export consistently and import cleanly.

**Implementation Details:**
- Audit all scene files for export patterns
- Standardize on named exports: `export class FarmScene extends Phaser.Scene`
- Update all imports to use named imports
- Verify scene registration in Phaser game config

**Files to Touch:**
- `src/scenes/BootScene.ts`
- `src/scenes/PreloadScene.ts`
- `src/scenes/FarmScene.ts`
- `src/main.ts` — Scene registration

**State Keys Touched:** None

**Save Impact:** None

**Acceptance Checks:**
- [ ] All scenes use named exports
- [ ] `src/main.ts` imports all scenes correctly
- [ ] Game boots into BootScene → PreloadScene → FarmScene

**Risks and Fallback:**
- Risk: Phaser scene registration breaks → Fallback: Test each scene individually

---

#### 1.1.4 — Validate Redux Store Composes Valid Slices
**Problem:** Combined slice code in store.ts may be invalid or have type mismatches.

**Outcome:** Store composes all slices with correct RootState typing.

**Implementation Details:**
- Split any combined slice code into dedicated files
- Ensure each slice has proper `createSlice` configuration
- Verify `RootState` type includes all slice states
- Add selector factory functions for common state access

**Files to Touch:**
- `src/state/store.ts` — Refactor slice composition
- `src/state/slices/` — Create dedicated files for each slice
- `src/state/types.ts` — Verify RootState export

**State Keys Touched:** All (structural refactor)

**Save Impact:** Backward-compatible (same state shape)

**Acceptance Checks:**
- [ ] `RootState` type correctly reflects all slices
- [ ] All selectors have proper return types
- [ ] No `as any` casts in store configuration

**Risks and Fallback:**
- Risk: State shape changes → Fallback: Add migration if needed

---

## Sprint 1.2 — Time/Day Loop Hardening

### Objective
Create a deterministic tick system that advances time, handles day boundaries, and provides hooks for daily resets.

### Why This Matters
Time is the heartbeat of the game. Every other system (growth, schedules, events) depends on reliable time advancement.

### Detailed Tasks

#### 1.2.1 — Implement Deterministic Tick System (10-Minute Increments)
**Problem:** Current time system may not tick consistently or deterministically.

**Outcome:** Time advances in exact 10-minute increments, 6 ticks per hour, deterministic across all sessions.

**Implementation Details:**
- Refactor `src/systems/timeSystem.js` to TypeScript
- Create `TimeState` interface: `{ hour: number, minute: number, day: number, season: string, year: number }`
- Implement `tick()` function that advances 10 minutes
- Add `TICK_INTERVAL_MS` constant (default 2000ms real time = 10 min game time)
- Ensure tick is pausable (for menus, cutscenes)

**Files to Touch:**
- `src/systems/timeSystem.ts` (rename from .js)
- `src/state/slices/timeSlice.ts` — Create if not exists
- `src/state/types.ts` — Add TimeState

**State Keys Touched:**
- `time.hour`
- `time.minute`
- `time.day`
- `time.season`
- `time.year`
- `time.isPaused`

**Save Impact:** Backward-compatible (new slice)

**Acceptance Checks:**
- [ ] Time advances 10 minutes every tick
- [ ] 6:00 → 6:10 → 6:20 → ... → 6:50 → 7:00
- [ ] Ticks pause when `isPaused` is true
- [ ] Deterministic: same start time + N ticks = same end time

**Risks and Fallback:**
- Risk: Performance issues with frequent ticks → Fallback: Batch updates, use requestAnimationFrame

---

#### 1.2.2 — Implement Valid Day Boundaries (6:00 AM to 2:00 AM)
**Problem:** Day boundaries may not handle the 2:00 AM pass-out time correctly.

**Outcome:** Day runs from 6:00 AM to 2:00 AM (20 hours). At 2:00 AM, player passes out.

**Implementation Details:**
- Define day start: 6:00 (hour 6, minute 0)
- Define day end/pass-out: 2:00 (hour 2, minute 0) — this is 2 AM next day in 24h time, or handle as special case
- Actually: Use 20-hour day: 6:00 AM to 2:00 AM next day
- At 2:00 AM, trigger pass-out event
- Pass-out: player loses some money, wakes up at 6:00 AM next day

**Files to Touch:**
- `src/systems/timeSystem.ts` — Day boundary logic
- `src/state/slices/timeSlice.ts` — Pass-out state
- `src/scenes/FarmScene.ts` — Pass-out UI/animation

**State Keys Touched:**
- `time.isPassOut`
- `player.energy` (set to 0 on pass-out)
- `player.money` (deduct penalty)

**Save Impact:** New state keys

**Acceptance Checks:**
- [ ] Day advances from 6:00 AM to 2:00 AM (20 hours)
- [ ] At 2:00 AM, pass-out event triggers
- [ ] Player wakes at 6:00 AM next day
- [ ] Pass-out penalty applied (money loss)

**Risks and Fallback:**
- Risk: Time math errors → Fallback: Extensive unit tests for time calculations

---

#### 1.2.3 — Implement Sleep Transition and Daily Reset Hook Interface
**Problem:** No clean way to transition from day to night and trigger daily resets.

**Outcome:** Sleep action advances day, triggers all daily reset hooks, saves game.

**Implementation Details:**
- Create `sleep()` function in time system
- Sleep can be triggered by:
  - Player choosing to sleep (bed interaction)
  - Pass-out at 2:00 AM
- Sleep sequence:
  1. Fade to black
  2. Calculate end-of-day (shipping, relationships, etc.)
  3. Advance to 6:00 AM next day
  4. Trigger daily reset hooks
  5. Auto-save
  6. Fade in new day
- Create hook interface: `onDayEnd()` and `onDayStart()` callbacks

**Files to Touch:**
- `src/systems/timeSystem.ts` — Sleep logic
- `src/systems/dailyResetSystem.ts` — New file for reset hooks
- `src/scenes/FarmScene.ts` — Sleep UI/animation
- `src/storage/saveService.ts` — Auto-save on sleep

**State Keys Touched:**
- `time.day` (increment)
- `time.hour` (reset to 6)
- `time.minute` (reset to 0)
- `player.energy` (restore to max)

**Save Impact:** Auto-save creates new save data

**Acceptance Checks:**
- [ ] Sleep fades to black, advances day, fades in
- [ ] All registered `onDayEnd` hooks fire
- [ ] All registered `onDayStart` hooks fire
- [ ] Auto-save completes before fade-in
- [ ] Energy restored to maximum

**Risks and Fallback:**
- Risk: Hooks fail, blocking sleep → Fallback: Try/catch each hook, log errors

---

#### 1.2.4 — Create Time Simulation Test Suite
**Problem:** No automated way to verify time system correctness.

**Outcome:** Automated tests validate day/hour rollover and season progression.

**Implementation Details:**
- Create `tests/timeSystem.test.ts`
- Test cases:
  - 6:00 + 6 ticks = 7:00
  - 23:50 + 2 ticks = 0:00 next day
  - Day 28 + 1 day = Day 1 next season
  - Season 4 + 1 season = Season 1 next year
- Use Jest or Vitest for testing

**Files to Touch:**
- `tests/timeSystem.test.ts` (create)
- `package.json` — Add test script if not exists

**State Keys Touched:** None (test file)

**Save Impact:** None

**Acceptance Checks:**
- [ ] All time tests pass
- [ ] Tests cover edge cases (season rollover, year rollover)
- [ ] Tests run in CI/CD pipeline

**Risks and Fallback:**
- Risk: Test environment differs from runtime → Fallback: Integration tests in browser

---

## Sprint 1.3 — Farm Tile Interaction Baseline

### Objective
Create a tile state machine that handles the full lifecycle: untilled → tilled → watered → planted → growing → harvestable.

### Why This Matters
Farming is the core loop. Without reliable tile interactions, the game has no primary activity.

### Detailed Tasks

#### 1.3.1 — Define Tile State Machine
**Problem:** No formal state machine for farm tiles.

**Outcome:** Each tile has explicit state with valid transitions.

**Implementation Details:**
- Create `TileState` type:
  ```typescript
  type TileState = 
    | 'untilled' 
    | 'tilled' 
    | 'watered' 
    | 'planted'
    | 'growing'
    | 'harvestable'
    | 'dead';
  ```
- Define valid transitions:
  - untilled → tilled (hoe)
  - tilled → watered (watering can)
  - tilled → planted (seed)
  - watered → planted (seed)
  - planted → growing (time)
  - growing → harvestable (time)
  - growing → dead (season end, no water)
  - harvestable → untilled (harvest)
- Create `canTransition(from, to, tool)` helper

**Files to Touch:**
- `src/types/farm.ts` — TileState type
- `src/systems/tileSystem.ts` — State machine logic

**State Keys Touched:**
- `farm.tiles[].state`

**Save Impact:** New state structure

**Acceptance Checks:**
- [ ] All valid transitions work
- [ ] Invalid transitions are rejected
- [ ] State machine is unit tested

**Risks and Fallback:**
- Risk: Complex state logic → Fallback: Start with simpler 4-state machine

---

#### 1.3.2 — Implement Tile Targeting and Selection
**Problem:** No way for player to select/interact with specific tiles.

**Outcome:** Player can target any tile with tap/click, visual feedback shows selected tile.

**Implementation Details:**
- Add tile grid overlay to FarmScene
- Implement `getTileAt(x, y)` that converts screen coords to tile coords
- Show highlight/selector sprite on targeted tile
- Handle tap/click events on tile map
- Support keyboard/controller targeting (arrow keys + confirm)

**Files to Touch:**
- `src/scenes/FarmScene.ts` — Tile targeting
- `src/components/TileSelector.ts` — New component
- `src/input/farmInput.ts` — Input handling

**State Keys Touched:**
- `ui.selectedTile` — {x, y} or null

**Save Impact:** UI state only (not persisted)

**Acceptance Checks:**
- [ ] Tap/click selects tile
- [ ] Visual highlight appears on selected tile
- [ ] Deselect when tapping elsewhere
- [ ] Works on mobile touch

**Risks and Fallback:**
- Risk: Touch vs mouse handling differences → Fallback: Use Phaser's input system

---

#### 1.3.3 — Implement Tool Use on Tiles
**Problem:** Tools don't affect tile states.

**Outcome:** Using hoe tills, watering can waters, seeds plant.

**Implementation Details:**
- Create `useTool(toolId, tileX, tileY)` function
- Tool effects:
  - Hoe: untilled → tilled
  - Watering Can: tilled → watered (or stays watered)
  - Seeds: tilled/watered → planted (consumes seed)
- Check tool requirements (energy, seed inventory)
- Play tool animation
- Update tile state

**Files to Touch:**
- `src/systems/toolSystem.ts` — Tool use logic
- `src/systems/tileSystem.ts` — Tile state updates
- `src/scenes/FarmScene.ts` — Tool animation
- `src/state/slices/inventorySlice.ts` — Seed consumption

**State Keys Touched:**
- `farm.tiles[].state`
- `farm.tiles[].cropId` (when planting)
- `farm.tiles[].plantDate` (when planting)
- `player.energy` (decrement)
- `inventory.items[]` (seed consumption)

**Save Impact:** All changes persisted

**Acceptance Checks:**
- [ ] Hoe tills untilled ground
- [ ] Watering can waters tilled ground
- [ ] Seeds plant on tilled/watered ground
- [ ] Seeds consumed from inventory
- [ ] Energy consumed per tool use
- [ ] Invalid tool use shows feedback

**Risks and Fallback:**
- Risk: Tool use feels unresponsive → Fallback: Immediate visual feedback, async state update

---

#### 1.3.4 — Create Tile Lifecycle Reducer Tests
**Problem:** No automated verification of tile state transitions.

**Outcome:** Comprehensive tests for all tile state transitions.

**Implementation Details:**
- Test all state transitions:
  - untilled → tilled (hoe)
  - tilled → watered (watering can)
  - tilled → planted (seeds)
  - planted → growing (next day with water)
  - growing → harvestable (growth complete)
  - harvestable → untilled (harvest)
- Test invalid transitions are blocked
- Test edge cases (planting without seeds, etc.)

**Files to Touch:**
- `tests/tileSystem.test.ts`

**State Keys Touched:** None (test file)

**Save Impact:** None

**Acceptance Checks:**
- [ ] All valid transitions tested
- [ ] All invalid transitions rejected
- [ ] 100% coverage of tile state logic

**Risks and Fallback:**
- Risk: Tests become brittle → Fallback: Test behavior, not implementation

---

## Sprint 1.4 — Shipping and Money Loop

### Objective
Create the economic loop: items → shipping bin → end-of-day valuation → money.

### Why This Matters
Without money progression, there's no sense of achievement or advancement.

### Detailed Tasks

#### 1.4.1 — Implement Shipping Bin Inventory Intake
**Problem:** No way to sell items.

**Outcome:** Player can place items in shipping bin, items queued for end-of-day sale.

**Implementation Details:**
- Create shipping bin UI/interaction
- Items placed in bin are removed from inventory
- Items in bin tracked separately (not immediate sale)
- Show shipping bin contents preview
- Allow removing items before day ends (optional)

**Files to Touch:**
- `src/components/ShippingBin.ts`
- `src/systems/shippingSystem.ts`
- `src/state/slices/shippingSlice.ts`

**State Keys Touched:**
- `shipping.items[]` — {itemId, quantity, quality}
- `inventory.items[]` (decrement)

**Save Impact:** New shipping slice

**Acceptance Checks:**
- [ ] Items can be placed in shipping bin
- [ ] Items removed from inventory
- [ ] Shipping bin shows contents
- [ ] Items persist until day end

**Risks and Fallback:**
- Risk: Accidental sales → Fallback: Allow undo/remove before sleep

---

#### 1.4.2 — Implement End-of-Day Valuation
**Problem:** No calculation of daily earnings.

**Outcome:** At day end, shipping bin items valued and sold.

**Implementation Details:**
- Create `calculateDailyEarnings()` function
- Base value from item data (`src/data/items.json`)
- Quality multiplier: normal=1x, silver=1.25x, gold=1.5x, iridium=2x
- Sum all shipping bin items
- Clear shipping bin after valuation
- Return earnings breakdown

**Files to Touch:**
- `src/systems/shippingSystem.ts`
- `src/data/items.json` — Ensure all items have baseValue

**State Keys Touched:**
- `shipping.items[]` (cleared)
- `shipping.dailyTotal` (set)
- `shipping.breakdown[]` (set)

**Save Impact:** Daily report persisted

**Acceptance Checks:**
- [ ] Each item valued correctly
- [ ] Quality multipliers applied
- [ ] Total calculated accurately
- [ ] Shipping bin cleared after
- [ ] Breakdown shows itemized list

**Risks and Fallback:**
- Risk: Floating point math errors → Fallback: Use integer cents internally

---

#### 1.4.3 — Implement Money Update and Daily Report
**Problem:** Money doesn't update from sales.

**Outcome:** Daily earnings added to player money, daily report shown.

**Implementation Details:**
- Add earnings to `player.money`
- Create daily report UI:
  - List of items sold
  - Individual earnings
  - Total earnings
  - Running total money
- Show report after sleep fade, before new day
- Allow skipping report (press any key)

**Files to Touch:**
- `src/systems/shippingSystem.ts`
- `src/scenes/DailyReportScene.ts` — New scene or overlay
- `src/state/slices/playerSlice.ts` — Money update

**State Keys Touched:**
- `player.money` (increment)
- `shipping.dailyReport` (set for display)

**Save Impact:** Money persisted

**Acceptance Checks:**
- [ ] Money increases by correct amount
- [ ] Daily report displays correctly
- [ ] Report can be skipped
- [ ] Report shows accurate breakdown

**Risks and Fallback:**
- Risk: Report interrupts flow → Fallback: Make it quick, skippable

---

#### 1.4.4 — Prevent Double-Sell Exploits
**Problem:** Potential exploits: duplicate sales, negative values.

**Outcome:** Robust validation prevents all economy exploits.

**Implementation Details:**
- Validate item exists in inventory before shipping
- Validate quantity > 0
- Validate item not already in shipping bin (if no duplicates allowed)
- Use transactions: remove from inventory AND add to bin atomically
- Server-side validation if multiplayer (future)

**Files to Touch:**
- `src/systems/shippingSystem.ts`
- `src/state/slices/inventorySlice.ts`

**State Keys Touched:** None (validation layer)

**Save Impact:** None

**Acceptance Checks:**
- [ ] Cannot sell item not in inventory
- [ ] Cannot sell negative quantity
- [ ] Cannot sell same item twice (if restricted)
- [ ] Atomic operations prevent partial state

**Risks and Fallback:**
- Risk: Overly restrictive → Fallback: Allow undo within same day

---

## Sprint 1.5 — Save/Load Slot Integrity

### Objective
Create reliable save system: slots, auto-save, load with validation.

### Why This Matters
Without persistence, players lose all progress. This is a ship-blocking feature.

### Detailed Tasks

#### 1.5.1 — Implement Save Slot Create/Load/Delete
**Problem:** No save slot management.

**Outcome:** Multiple save slots, each with independent game state.

**Implementation Details:**
- Create save slot schema:
  ```typescript
  interface SaveSlot {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    version: string;
    preview: { day: number, season: string, money: number };
    data: GameState;
  }
  ```
- Implement `createSlot()`, `loadSlot(id)`, `deleteSlot(id)`
- Store in IndexedDB via Dexie
- Maximum slots: 10 (configurable)

**Files to Touch:**
- `src/storage/saveService.ts`
- `src/storage/dexie.ts` — SaveSlot table
- `src/state/slices/saveSlice.ts` — UI state

**State Keys Touched:**
- `save.slots[]`
- `save.currentSlotId`

**Save Impact:** Core save system

**Acceptance Checks:**
- [ ] Can create new save slot
- [ ] Can load existing slot
- [ ] Can delete slot
- [ ] Max slots enforced
- [ ] Slot metadata displays correctly

**Risks and Fallback:**
- Risk: Storage quota exceeded → Fallback: Error handling, compression

---

#### 1.5.2 — Implement Auto-Save on Sleep
**Problem:** Player must remember to save.

**Outcome:** Game auto-saves every time player sleeps.

**Implementation Details:**
- Trigger save at end of sleep sequence
- Use current slot (or create "Auto" slot if none selected)
- Show save indicator (brief)
- Handle save errors gracefully
- Don't block on save (async)

**Files to Touch:**
- `src/systems/timeSystem.ts` — Sleep hook
- `src/storage/saveService.ts` — Auto-save logic
- `src/components/SaveIndicator.ts`

**State Keys Touched:** All (full state saved)

**Save Impact:** Auto-save creates/updates slot

**Acceptance Checks:**
- [ ] Auto-save triggers on sleep
- [ ] Save completes before new day starts
- [ ] Indicator shows during save
- [ ] Errors handled gracefully

**Risks and Fallback:**
- Risk: Save corruption during write → Fallback: Write to temp, then swap

---

#### 1.5.3 — Implement Guarded Load Behavior
**Problem:** Corrupt or null saves may crash game.

**Outcome:** Robust load with validation and recovery options.

**Implementation Details:**
- Validate save data structure before loading
- Check version compatibility
- Handle missing fields (use defaults)
- If corrupt: show error, offer to delete or ignore
- If null/empty: treat as new game
- Create `validateSave(data)` function

**Files to Touch:**
- `src/storage/saveService.ts`
- `src/scenes/LoadGameScene.ts`

**State Keys Touched:** None (validation layer)

**Save Impact:** None

**Acceptance Checks:**
- [ ] Valid save loads correctly
- [ ] Corrupt save detected, error shown
- [ ] Missing fields use defaults
- [ ] Version mismatch handled

**Risks and Fallback:**
- Risk: False positive corruption detection → Fallback: Lenient validation

---

#### 1.5.4 — Add Save Metadata (Version + Timestamp)
**Problem:** No way to track save compatibility or age.

**Outcome:** All saves include version and timestamps.

**Implementation Details:**
- Add `version` field (matches game version)
- Add `createdAt` timestamp
- Add `updatedAt` timestamp
- Add `playTime` (total seconds played)
- Display in load game UI

**Files to Touch:**
- `src/storage/saveService.ts`
- `src/scenes/LoadGameScene.ts`

**State Keys Touched:**
- `meta.version`
- `meta.createdAt`
- `meta.updatedAt`
- `meta.playTime`

**Save Impact:** Metadata persisted

**Acceptance Checks:**
- [ ] Version stored correctly
- [ ] Timestamps accurate
- [ ] Play time tracked
- [ ] Displayed in load UI

**Risks and Fallback:**
- Risk: Clock changes affect timestamps → Fallback: Use monotonic clock if available

---

#### 1.5.5 — Create Save/Load Integration Tests
**Problem:** No verification that save/load actually works.

**Outcome:** Automated tests prove state survives save/load cycle.

**Implementation Details:**
- Test: Save game → Load game → State identical
- Test: Reload mid-day → Time/tiles/inventory restored
- Test: Reload post-sleep → Day/earnings restored
- Test: Multiple slots don't interfere
- Mock IndexedDB for testing

**Files to Touch:**
- `tests/saveLoad.test.ts`

**State Keys Touched:** None (test file)

**Save Impact:** None

**Acceptance Checks:**
- [ ] Save/load cycle preserves all state
- [ ] Mid-day reload works
- [ ] Post-sleep reload works
- [ ] Multiple slots isolated

**Risks and Fallback:**
- Risk: Mock doesn't match real IndexedDB → Fallback: Browser-based integration tests

---

## Sprint 1.6 — Mobile-First Baseline Controls

### Objective
Create touch-friendly controls that work on mobile devices.

### Why This Matters
Mobile is the primary target. Controls must feel native on touchscreens.

### Detailed Tasks

#### 1.6.1 — Implement Tap Interaction
**Problem:** Mouse-centric input doesn't translate to touch.

**Outcome:** All interactions work with single tap.

**Implementation Details:**
- Tap to select tile
- Tap tool button to select tool
- Tap inventory item to select
- Tap and hold for context menu (optional)
- Prevent double-tap zoom (CSS)
- Handle touch events: `touchstart`, `touchend`

**Files to Touch:**
- `src/input/touchInput.ts` — New file
- `src/scenes/FarmScene.ts` — Touch handlers
- `src/index.html` — Viewport meta tag

**State Keys Touched:**
- `ui.selectedTool`
- `ui.selectedItem`

**Save Impact:** None

**Acceptance Checks:**
- [ ] Tap selects tile
- [ ] Tap selects tool
- [ ] No accidental zoom
- [ ] Touch feels responsive

**Risks and Fallback:**
- Risk: Touch vs mouse conflicts → Fallback: Feature detection, separate handlers

---

#### 1.6.2 — Implement One Movement Mode
**Problem:** Multiple movement schemes confuse players.

**Outcome:** Single, reliable movement mode for mobile.

**Implementation Details:**
- Use virtual joystick or tap-to-move
- Decision: Virtual joystick for precision
- Joystick appears on touch, fades when released
- Player moves in joystick direction
- Speed proportional to joystick distance from center
- Stop when joystick released

**Files to Touch:**
- `src/components/VirtualJoystick.ts`
- `src/scenes/FarmScene.ts`
- `src/input/touchInput.ts`

**State Keys Touched:**
- `player.position.x`
- `player.position.y`

**Save Impact:** Position persisted

**Acceptance Checks:**
- [ ] Joystick appears on touch
- [ ] Player moves in correct direction
- [ ] Speed scales with joystick distance
- [ ] Player stops on release
- [ ] Joystick doesn't block other UI

**Risks and Fallback:**
- Risk: Joystick feels sluggish → Fallback: Tap-to-move alternative

---

#### 1.6.3 — Create Minimum Viable HUD
**Problem:** No way to see critical info on screen.

**Outcome:** HUD shows time, day, money, stamina at all times.

**Implementation Details:**
- HUD elements:
  - Time (hour:minute)
  - Day (Day X of Season)
  - Money ($X)
  - Stamina (bar or hearts)
- Position: Top of screen, doesn't block game
- Responsive: Scales with screen size
- Update in real-time

**Files to Touch:**
- `src/components/HUD.ts`
- `src/scenes/FarmScene.ts` — HUD integration
- `src/ui/hud.css` — Styling

**State Keys Touched:** None (display only)

**Save Impact:** None

**Acceptance Checks:**
- [ ] Time displays correctly
- [ ] Day/season displays
- [ ] Money displays
- [ ] Stamina displays
- [ ] HUD visible on all screen sizes
- [ ] Updates in real-time

**Risks and Fallback:**
- Risk: HUD clutters screen → Fallback: Collapsible/minimal mode

---

#### 1.6.4 — Test on Mobile Viewport Emulation
**Problem:** Desktop development doesn't catch mobile issues.

**Outcome:** Verified touch target reliability on mobile viewport.

**Implementation Details:**
- Use Chrome DevTools mobile emulation
- Test viewports: iPhone SE (375×667), iPhone 12 (390×844), iPad (768×1024)
- Verify tap targets minimum 44×44 points
- Test with touch emulation enabled
- Document any issues

**Files to Touch:**
- None (testing activity)

**State Keys Touched:** None

**Save Impact:** None

**Acceptance Checks:**
- [ ] Tested on iPhone SE viewport
- [ ] Tested on iPhone 12 viewport
- [ ] Tested on iPad viewport
- [ ] All tap targets ≥ 44×44
- [ ] No UI overflow issues

**Risks and Fallback:**
- Risk: Emulation differs from real device → Fallback: Test on actual device

---

## Sprint 1 Exit Criteria

All of the following must be true to complete Sprint 1:

- [ ] **1.1** `npm run build` succeeds with zero errors
- [ ] **1.1** App boots into Farm scene without runtime exceptions
- [ ] **1.2** Time advances in 10-minute ticks correctly
- [ ] **1.2** Day boundaries (6 AM to 2 AM) work correctly
- [ ] **1.2** Sleep transition advances day and triggers resets
- [ ] **1.3** Full tile lifecycle works: till → water → plant → grow → harvest
- [ ] **1.3** Tool use consumes energy and inventory correctly
- [ ] **1.4** Items can be placed in shipping bin
- [ ] **1.4** End-of-day valuation calculates correctly
- [ ] **1.4** Money updates from sales
- [ ] **1.5** Save slots can be created, loaded, deleted
- [ ] **1.5** Auto-save on sleep works
- [ ] **1.5** Reload mid-day restores all state
- [ ] **1.5** Reload post-sleep restores day/earnings
- [ ] **1.6** Tap interaction works on mobile viewport
- [ ] **1.6** Movement controls work on mobile
- [ ] **1.6** HUD displays time/day/money/stamina

---

## Sprint 1 Dependencies

**External:** None

**Internal:** None (this is the foundation sprint)

**Blocked By:** Nothing

**Blocks:** Sprint 2 (Farming Progression System)

---

## Sprint 1 Notes for Agents

1. **Start with 1.1** — Don't build features on broken types
2. **Test constantly** — Run `npm run build` after every change
3. **Mobile-first** — Test on mobile viewport, not just desktop
4. **Save early, save often** — Persistence is the goal
5. **One vertical slice** — Don't build ahead of the core loop

**When in doubt:** Ask before building something not in this sprint.
