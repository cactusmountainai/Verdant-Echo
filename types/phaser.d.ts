// Minimal declaration for Phaser 3 game framework
// Phaser is a global-like UMD module. Actual usage: new Phaser.Game(), scene: Phaser.Scene
// DO NOT declare top-level Scene/Game classes — they live under the Phaser namespace.
// Installed via: npm install phaser
// If @types/phaser exists, prefer it. This is only for when types are missing.

declare namespace Phaser {
  interface SceneConfig {
    key?: string;
    active?: boolean;
    visible?: boolean;
    physics?: any;
  }

  class Scene {
    constructor(config?: SceneConfig);
    init(): void;
    preload(): void;
    create(): void;
    update(): void;
  }

  interface Config {
    type?: number;
    width?: number;
    height?: number;
    parent?: string | HTMLElement;
    scene?: any[];
  }

  class Game {
    constructor(config: Config);
  }
}

// Export namespace for module compatibility (though Phaser is usually global)
export = Phaser;
