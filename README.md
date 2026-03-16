# Farm Management Game - Project Status

## 📦 Project Structure

### Core Systems
- **Time System**: `src/systems/timeSystem.ts` - Daily reset cycle management
- **Storage**: `src/storage/dexie.ts` + `src/storage/saveService.ts` - Dexie.js DB integration
- **State**: `src/state/store.ts` - Vite/Vuex state management

### Models (Data Layer)
- `src/models/BaseModel.ts` - Abstract base for all entities
- `src/models/Project.ts` - Farm project data
- `src/models/User.ts` - User account data
- `src/models/ProjectTimeline.ts` - Timeline events
- `src/models/meeting.py` - Meeting logic (Python backend?)
- `src/models/storage.py` - Storage logic (Python backend?)
- `src/models/data_ingestion.py` - Data ingestion (Python backend?)
- `src/models/farm_scene.py` - Farm scene (Python backend?)
- `src/models/time_system.py` - Time system (Python backend?)
- `src/models/init_timeline.py` - Init timeline (Python backend?)

### Scenes (Phaser.js)
- `src/scenes/BootScene.ts` - App initialization
- `src/scenes/PreloadScene.ts` - Asset loading
- `src/scenes/FarmScene.ts` - Main farm game scene

### Services
- `src/services/dataImportService.ts` - Data import handling
- `src/services/dataIngestionService.ts` - Data ingestion
- `src/services/projectTimelineService.ts` - Timeline operations
- `src/services/meetingService.ts` - Meeting management
- `src/services/initTimelineService.ts` - Init timeline setup

### Config & Types
- `src/config/timelineConfig.ts` - Timeline configuration
- `src/state/types.ts` - TypeScript type definitions
- `types/dexie.d.ts` - Dexie type declarations
- `types/pako.d.ts` - Pako library types
- `types/phaser.d.ts` - Phaser library types

### Testing
- `test/calculator.test.ts` - Calculator unit tests

### Build Configuration
- `vite.config.ts` - Vite bundler config
- `jest.config.js` - Jest test config

## 🎯 Current Status
- **Frontend**: TypeScript + Phaser.js + Vite
- **Backend**: Python models (separate backend service)
- **Storage**: Dexie.js local DB + save/load system
- **Time System**: Daily reset cycle implemented

## 📝 Notes
- Python models appear to be for backend API integration
- TypeScript frontend handles game logic and UI
- Use `FILE:` markers for new documentation files
