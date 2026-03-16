# Verdant Echo

A Stardew Valley-inspired farming RPG for mobile and web browsers.

## What Is This?

Verdant Echo is a cozy farming simulation game where you:
- Grow crops across four seasons with realistic growth cycles
- Befriend quirky villagers with unique schedules and stories
- Explore mines, fish rivers, and forage the wilderness
- Build your farm from a overgrown field to a thriving homestead
- Fall in love, get married, start a family
- Discover the mysteries of the town and surrounding areas

## Game Pillars

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
