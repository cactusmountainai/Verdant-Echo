import TimeSystem from './systems/timeSystem';

interface GameObject {
  update(deltaTime: number): void;
  render(cameraX: number, cameraY: number): void;
}

export default class FarmScene {
  private objects: GameObject[] = [];
  private cameraX: number = 0;
  private cameraY: number = 0;
  private timeSystem: TimeSystem;

  constructor(timeSystem: TimeSystem) {
    this.timeSystem = timeSystem;
    
    // Initialize with default state
    this.cameraX = 0;
    this.cameraY = 0;
  }

  update(deltaTime: number): void {
    if (!this.objects || !Array.isArray(this.objects)) {
      console.error("FarmScene objects array is invalid");
      return;
    }
    
    for (const obj of this.objects) {
      try {
        obj.update(deltaTime);
      } catch (error) {
        console.error("Error updating game object:", error);
      }
    }
  }

  render(canvas: HTMLCanvasElement): void {
    if (!canvas || !canvas.getContext) {
      console.error("Invalid canvas element");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get 2D context from canvas");
      return;
    }

    // Clear screen with farm green background
    ctx.fillStyle = '#008000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render objects relative to camera position
    for (const obj of this.objects) {
      try {
        obj.render(this.cameraX, this.cameraY);
      } catch (error) {
        console.error("Error rendering game object:", error);
      }
    }
  }

  addObject(obj: GameObject): void {
    if (!obj || typeof obj.update !== 'function' || typeof obj.render !== 'function') {
      throw new Error("Object must have update() and render() methods");
    }
    
    this.objects.push(obj);
  }

  getCameraPosition(): { x: number, y: number } {
    return { x: this.cameraX, y: this.cameraY };
  }

  setCameraPosition(x: number, y: number): void {
    this.cameraX = x;
    this.cameraY = y;
  }
}
