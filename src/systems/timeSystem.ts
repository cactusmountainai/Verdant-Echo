export class TimeSystem {
  private time: number = 0
  private deltaTime: number = 0
  private lastTime: number = performance.now()

  update(): void {
    const now = performance.now()
    this.deltaTime = (now - this.lastTime) / 1000
    this.time += this.deltaTime
    this.lastTime = now
  }

  getTime(): number {
    return this.time
  }
}
