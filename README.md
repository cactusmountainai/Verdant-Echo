# Farm Management Application

A Phaser-based farm management game with time systems, data persistence, and project timeline tracking.

## 📁 Project Status
- ✅ Core models implemented
- ✅ Time system functional
- ✅ Storage layer (Dexie) configured
- ✅ Scenes (Boot, Preload, Farm) ready
- ⚙️ Services layer active (data ingestion, import, meetings)

## 🗂️ File Structure

### Configuration
- `vite.config.ts` - Build configuration
- `jest.config.js` - Test setup
- `src/config/index.ts` - Main config
- `src/config/loader.ts` - Config loader
- `src/config/timelineConfig.ts` - Timeline settings

### Models (`models/` & `src/models/`)
- `BaseModel.ts` - Base model class
- `User.ts` - User entity
- `Project.ts` - Project entity
- `ProjectTimeline.ts` - Project timeline
- `meeting.py` - Meeting model
- `storage.py` - Storage model
- `project_timeline.py` - Timeline model
- `base.py` - Base model
- `data_ingestion.py` - Data ingestion model
- `farm_scene.py` - Farm scene model
- `data_import.py` - Data import model
- `time_system.py` - Time system model
- `init_timeline.py` - Initial timeline setup

### Scenes (`src/scenes/`)
- `FarmScene.ts` - Main farm scene
- `PreloadScene.ts` - Asset loading
- `BootScene.ts` - Application bootstrap

### Systems (`src/systems/`)
- `timeSystem.ts` - Core time management
- `dailyResetSystem.ts` - Daily reset logic

### Services (`src/services/`)
- `dataImportService.ts` - Data import
- `dataIngestionService.ts` - Data ingestion
- `projectTimelineService.ts` - Timeline operations
- `meetingService.ts` - Meeting operations
- `initTimelineService.ts` - Timeline initialization

### Storage (`src/storage/` & `models/`)
- `dexie.ts` - Dexie database setup
- `saveService.ts` - Save/load service
- `storage.py` - Storage model

### State (`src/state/`)
- `store.ts` - Application state store
- `types.ts` - Type definitions

### Types
- `dexie.d.ts` - Dexie type declarations
- `pako.d.ts` - Pako compression types
- `phaser.d.ts` - Phaser type declarations

### Utilities
- `calculator.ts` - Calculation logic
- `hooks/useCropCycle.ts` - Crop cycle hook

## 🚀 Quick Start
