export abstract class BaseModel {
  id: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(id?: string) {
    if (id) {
      this.id = id;
    } else {
      this.id = `base-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}
