# FarmSimulator Project

A multi-agent farming simulation game built with Phaser 3 and TypeScript, featuring state management with Zustand and local storage via Dexie.js.

## Features
- Multi-agent system for NPCs and player interaction
- Persistent world state using Dexie.js (IndexedDB)
- Modular state store with slices for player, world, and meta data
- Scene-based architecture: Boot, Preload, FarmScene
- Vite-powered build system

## Technologies
- TypeScript
- Phaser 3
- Vite
- Zustand
- Dexie.js (IndexedDB wrapper)

## Setup

1. **Meaningful Progression** - Every day matters. Skills improve, relationships deepen, the farm expands.
2. **Living World** - NPCs have schedules, seasons change, weather affects gameplay.
3. **Player Freedom** - Farm how you want. Focus on crops, animals, fishing, mining, or socializing.
4. **Cozy Atmosphere** - Relaxing pace, charming pixel art, soothing soundtrack.

## Current Status

This game is being built using an autonomous multi-agent coding system.

- **Engine:** HTML5 Canvas + JavaScript
- **Storage:** IndexedDB (client-side)
- **Graphics:** Simple pixel art aesthetic
- **Audio:** Web Audio API

## How to Play (When Ready)

```bash
# Open in browser
open index.html
```

Or serve locally:
```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Project Structure

| File | Purpose |
|------|---------|
| `index.html` | Main entry point |
| `src/` | Game source code |
| `assets/` | Sprites, audio, data |
| `GOAL.md` | Full game design document |
| `SPRINT_PLAN.md` | Six-stage execution plan for multi-agent delivery |

## Development

This project uses an autonomous coding system with 4 agents:
- **Manager** - Breaks tasks into steps
- **ContextBuilder** - Gathers relevant code context
- **Coder** - Implements features
- **Reviewer** - Validates work

See `GOAL.md` for complete game design, mechanics, and content.

---

*Built with patience, one feature at a time.*
