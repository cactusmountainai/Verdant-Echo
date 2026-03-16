# Farm Management Game

## Project Status
- **Status**: Active Development
- **Framework**: Phaser 3 + TypeScript
- **Storage**: Dexie.js (IndexedDB wrapper)
- **Build**: Vite

## File Structure

### Core Entry Points
- `main.ts` / `main.js` - Application entry
- `src/main.ts` - TypeScript main entry
- `src/app.module.ts` - Module configuration

### Scenes
| Scene | Location | Purpose |
|-------|----------|---------|
| BootScene | `src/scenes/BootScene.ts` | App initialization |
| PreloadScene | `src/scenes/PreloadScene.ts` | Asset loading |
| FarmScene | `src/scenes/FarmScene.ts` | Main gameplay |

### Systems
- `src/systems/timeSystem.ts` - Time progression
- `src/systems/dailyResetSystem.ts` - Daily mechanics
- `src/systems/tileSystem.ts` - Farm tiles

### Services
| Service | Location | Responsibility |
|---------|----------|----------------|
| Data Import | `src/services/dataImportService.ts` | Import data |
| Data Ingestion | `src/services/dataIngestionService.ts` | Process data |
| Project Timeline | `src/services/projectTimelineService.ts` | Project scheduling |
| Meeting | `src/services/meetingService.ts` | Meeting logic |
| Init Timeline | `src/services/initTimelineService.ts` | Initial setup |

### Storage
- `src/storage/dexie.ts` - Database layer
- `src/storage/saveService.ts` - Save/load operations

### Models
- `src/models/BaseModel.ts` - Base model class
- `src/models/Project.ts` - Project data
- `src/models/User.ts` - User data
- `src/models/ProjectTimeline.ts` - Timeline model

### State & Config
- `src/state/types.ts` - State type definitions
- `src/config/timelineConfig.ts` - Timeline settings
- `src/config/loader.ts` - Config loader

### Utilities
- `src/hooks/useCropCycle.ts` - Crop cycle hook
- `src/lib/dexie.ts` - Dexie utilities
- `src/calculator.ts` - Calculations logic

### Type Definitions
- `types/dexie.d.ts` - Dexie types
- `types/pako.d.ts` - Pako compression types
- `types/phaser.d.ts` - Phaser types

### Testing
- `test/calculator.test.ts` - Calculator tests

## Quick Notes
- Background task: Documentation updates
- Main code continues in parallel
- No critical changes to production code
