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

### Task 1.1.1 — Fix TypeScript Compilation Errors

**Action:** Fix all TypeScript errors so `npm run build` exits with code 0.

**Implementation:**
- Run `npm run build` to get the error list
- Fix every error in `src/state/slices/*.ts` (add explicit types)
- Fix every error in `src/scenes/*.ts` (add return types to methods)
- Add `src/types/pako.d.ts` to fix pako import errors
- Add `src/types/dexie.d.ts` to fix dexie import errors
- Enable `"strict": true` in `tsconfig.json` if not already set

**Files to Touch:**
- `src/state/store.ts`
- `src/state/slices/*.ts`
- `src/scenes/*.ts`
- `src/lib/dexie.ts`
- `src/types/pako.d.ts` (create)
- `src/types/dexie.d.ts` (create)
- `tsconfig.json`

**Acceptance:** `npm run build` exits with code 0

---

### Task 1.1.2 — Fix Circular Dependencies in Redux Store

**Action:** Remove all circular imports between slices and store.

**Implementation:**
- Find all files in `src/state/slices/` that import from `src/state/store.ts`
- Remove those imports
- Convert any `store.dispatch()` calls in reducers to standard action creators
- Create `src/state/middleware.ts` if side effects need to move out of reducers

**Files to Touch:**
- `src/state/store.ts`
- `src/state/slices/*.ts`
- `src/state/middleware.ts` (create if needed)

**Acceptance:** No slice file imports from store.ts

---

### Task 1.1.3 — Fix Scene Import/Export Mismatches

**Action:** Standardize all scene files to use named exports.

**Implementation:**
- Change `src/scenes/BootScene.ts` to use `export class BootScene`
- Change `src/scenes/PreloadScene.ts` to use `export class PreloadScene`
- Change `src/scenes/FarmScene.ts` to use `export class FarmScene`
- Update `src/main.ts` to use named imports: `import { BootScene } from './scenes/BootScene'`
- Ensure all scenes are registered in Phaser game config

**Files to Touch:**
- `src/scenes/BootScene.ts`
- `src/scenes/PreloadScene.ts`
- `src/scenes/FarmScene.ts`
- `src/main.ts`

**Acceptance:** Game boots through Boot → Preload → Farm scenes

---

### Task 1.1.4 — Fix Redux Store Slice Composition

**Action:** Refactor store.ts to properly compose all slices with correct types.

**Implementation:**
- Split any combined slice code in `store.ts` into separate files
- Ensure each slice uses `createSlice` with proper name, initialState, reducers
- Export `RootState` type from `src/state/types.ts`
- Add selector functions in each slice file

**Files to Touch:**
- `src/state/store.ts`
- `src/state/types.ts` (create if not exists)
- `src/state/slices/*.ts`

**Acceptance:** `RootState` type correctly reflects all slices

---

## Sprint 1.2 — Time/Day Loop Hardening

### Task 1.2.1 — Implement Tick System

**Action:** Create time system that advances 10 minutes per tick.

**Implementation:**
- Create `src/systems/timeSystem.ts`
- Implement `tick()` function that adds 10 minutes to game time
- Handle hour rollover (60 min → next hour)
- Handle day rollover (2:00 AM → 6:00 AM next day)
- Create `src/state/slices/timeSlice.ts` with TimeState

**Files to Touch:**
- `src/systems/timeSystem.ts` (create)
- `src/state/slices/timeSlice.ts` (create)
- `src/state/types.ts`

**Acceptance:** Time advances 6:00 → 6:10 → 6:20 → 7:00 correctly

---

### Task 1.2.2 — Implement Day Boundaries

**Action:** Create day cycle from 6:00 AM to 2:00 AM with pass-out at 2:00 AM.

**Implementation:**
- Define day start (6:00) and end (2:00 AM next day = 26:00)
- At 2:00 AM, trigger pass-out: fade to black, show "You passed out" message
- Deduct 10% money as penalty
- Advance to 6:00 AM next day
- Restore energy to max

**Files to Touch:**
- `src/systems/timeSystem.ts`
- `src/scenes/FarmScene.ts` (pass-out UI)

**Acceptance:** At 2:00 AM, player passes out and wakes at 6:00 AM next day

---

### Task 1.2.3 — Implement Sleep Transition

**Action:** Create sleep action that advances day and triggers resets.

**Implementation:**
- Create `sleep()` function in timeSystem.ts
- Fade to black, run end-of-day calculations, fade in new day
- Call all registered `onDayEnd` callbacks
- Call all registered `onDayStart` callbacks
- Trigger auto-save after callbacks complete

**Files to Touch:**
- `src/systems/timeSystem.ts`
- `src/systems/dailyResetSystem.ts` (create for hooks)
- `src/scenes/FarmScene.ts`

**Acceptance:** Sleep advances day, fires callbacks, saves game

---

## Sprint 1.3 — Farm Tile Interaction Baseline

### Task 1.3.1 — Create Tile State Machine

**Action:** Define tile states and valid transitions.

**Implementation:**
- Create `src/types/farm.ts` with `TileState` type
- Define states: 'untilled' | 'tilled' | 'watered' | 'planted' | 'growing' | 'harvestable' | 'dead'
- Create `canTransition(from, to, tool)` function
- Implement transition logic in `src/systems/tileSystem.ts`

**Files to Touch:**
- `src/types/farm.ts` (create)
- `src/systems/tileSystem.ts` (create)

**Acceptance:** State machine allows valid transitions, rejects invalid ones

---

### Task 1.3.2 — Implement Tile Targeting

**Action:** Add tap/click to select tiles with visual feedback.

**Implementation:**
- Add tile grid to FarmScene
- Implement `getTileAt(x, y)` for screen-to-tile conversion
- Create `src/components/TileSelector.ts` with highlight sprite
- Show highlight on selected tile
- Store selected tile in `ui.selectedTile`

**Files to Touch:**
- `src/scenes/FarmScene.ts`
- `src/components/TileSelector.ts` (create)
- `src/state/slices/uiSlice.ts`

**Acceptance:** Tap highlights tile, tap elsewhere deselects

---

### Task 1.3.3 — Implement Tool Use

**Action:** Make tools affect tile states.

**Implementation:**
- Create `src/systems/toolSystem.ts` with `useTool(toolId, tileX, tileY)`
- Hoe: untilled → tilled
- Watering Can: tilled → watered
- Seeds: tilled/watered → planted (consumes seed from inventory)
- Deduct energy on each tool use
- Play tool animation

**Files to Touch:**
- `src/systems/toolSystem.ts` (create)
- `src/scenes/FarmScene.ts`
- `src/state/slices/inventorySlice.ts`
- `src/state/slices/playerSlice.ts`

**Acceptance:** Hoe tills, watering can waters, seeds plant and consume inventory

---

## Sprint 1.4 — Shipping and Money Loop

### Task 1.4.1 — Implement Shipping Bin

**Action:** Create shipping bin UI and inventory intake.

**Implementation:**
- Create `src/components/ShippingBin.ts`
- Create `src/state/slices/shippingSlice.ts`
- Remove items from inventory when placed in bin
- Track items in `shipping.items[]`
- Show bin contents preview

**Files to Touch:**
- `src/components/ShippingBin.ts` (create)
- `src/systems/shippingSystem.ts` (create)
- `src/state/slices/shippingSlice.ts` (create)
- `src/state/slices/inventorySlice.ts`

**Acceptance:** Items can be placed in bin, removed from inventory

---

### Task 1.4.2 — Implement End-of-Day Valuation

**Action:** Calculate daily earnings from shipping bin.

**Implementation:**
- Create `calculateDailyEarnings()` in shippingSystem.ts
- Get base value from `src/data/items.json`
- Apply quality multiplier (normal=1x, silver=1.25x, gold=1.5x, iridium=2x)
- Sum all items, clear bin, store total

**Files to Touch:**
- `src/systems/shippingSystem.ts`
- `src/data/items.json` (ensure baseValue exists)

**Acceptance:** Shipping bin items valued correctly, total calculated

---

### Task 1.4.3 — Implement Money Update

**Action:** Add earnings to player money and show daily report.

**Implementation:**
- Add earnings to `player.money`
- Create `src/scenes/DailyReportScene.ts` or overlay
- Show itemized list of sales
- Show total earnings and new money total
- Allow skipping report with key/tap

**Files to Touch:**
- `src/systems/shippingSystem.ts`
- `src/scenes/DailyReportScene.ts` (create)
- `src/state/slices/playerSlice.ts`

**Acceptance:** Money increases, daily report displays, can be skipped

---

## Sprint 1.5 — Save/Load Slot Integrity

### Task 1.5.1 — Implement Save Slots

**Action:** Create save slot system with CRUD operations.

**Implementation:**
- Define `SaveSlot` interface with id, name, timestamps, preview, data
- Create `src/storage/saveService.ts` with `createSlot()`, `loadSlot()`, `deleteSlot()`
- Store in IndexedDB via Dexie
- Limit to 10 slots maximum

**Files to Touch:**
- `src/storage/saveService.ts` (create)
- `src/storage/dexie.ts`
- `src/state/slices/saveSlice.ts` (create)

**Acceptance:** Can create, load, delete save slots

---

### Task 1.5.2 — Implement Auto-Save

**Action:** Auto-save game when player sleeps.

**Implementation:**
- Hook into sleep sequence in timeSystem.ts
- Call `saveService.autoSave()` at end of sleep
- Show brief save indicator
- Handle errors gracefully

**Files to Touch:**
- `src/systems/timeSystem.ts`
- `src/storage/saveService.ts`
- `src/components/SaveIndicator.ts` (create)

**Acceptance:** Game saves automatically on sleep

---

### Task 1.5.3 — Implement Load Validation

**Action:** Add validation and error handling to load function.

**Implementation:**
- Create `validateSave(data)` function in saveService.ts
- Check required fields exist
- Handle missing fields with defaults
- Show error if corrupt, offer to delete

**Files to Touch:**
- `src/storage/saveService.ts`

**Acceptance:** Corrupt saves detected, errors handled gracefully

---

### Task 1.5.4 — Add Save Metadata

**Action:** Include version and timestamps in save data.

**Implementation:**
- Add `version` field to save (use game version)
- Add `createdAt` and `updatedAt` timestamps
- Add `playTime` tracking
- Display in load game UI

**Files to Touch:**
- `src/storage/saveService.ts`
- `src/scenes/LoadGameScene.ts` (create)

**Acceptance:** Saves include version, timestamps, playtime

---

## Sprint 1.6 — Mobile-First Baseline Controls

### Task 1.6.1 — Implement Tap Interaction

**Action:** Make all interactions work with single tap.

**Implementation:**
- Create `src/input/touchInput.ts`
- Handle tap to select tile
- Handle tap to select tool
- Handle tap to use tool on tile
- Prevent double-tap zoom with CSS

**Files to Touch:**
- `src/input/touchInput.ts` (create)
- `src/scenes/FarmScene.ts`
- `src/index.html` (viewport meta)

**Acceptance:** Tap selects tiles and tools, no accidental zoom

---

### Task 1.6.2 — Implement Virtual Joystick

**Action:** Add virtual joystick for mobile movement.

**Implementation:**
- Create `src/components/VirtualJoystick.ts`
- Joystick appears on touch, fades on release
- Player moves in joystick direction
- Speed scales with joystick distance from center

**Files to Touch:**
- `src/components/VirtualJoystick.ts` (create)
- `src/scenes/FarmScene.ts`
- `src/input/touchInput.ts`

**Acceptance:** Joystick moves player, stops on release

---

### Task 1.6.3 — Create HUD

**Action:** Add HUD showing time, day, money, stamina.

**Implementation:**
- Create `src/components/HUD.ts`
- Show time (HH:MM), day/season, money, stamina bar
- Position at top of screen
- Update every tick

**Files to Touch:**
- `src/components/HUD.ts` (create)
- `src/scenes/FarmScene.ts`

**Acceptance:** HUD displays all info, updates in real-time

---

## Sprint 1 Exit Criteria

- [ ] `npm run build` exits with code 0
- [ ] Game boots into Farm scene
- [ ] Time advances in 10-minute ticks
- [ ] Day boundaries work (6 AM to 2 AM)
- [ ] Sleep advances day
- [ ] Full tile lifecycle: till → water → plant → grow → harvest
- [ ] Tools consume energy and inventory
- [ ] Shipping bin accepts items
- [ ] End-of-day valuation works
- [ ] Money updates from sales
- [ ] Save slots work (create/load/delete)
- [ ] Auto-save on sleep works
- [ ] Reload restores all state
- [ ] Tap interaction works
- [ ] Virtual joystick works
- [ ] HUD displays time/day/money/stamina
