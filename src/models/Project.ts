export class Project {
  id?: string | number;
  name: string;
  location: string;
  areaHectares: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    name: string, 
    location: string, 
    areaHectares: number, 
    status: string = 'planned'
  ) {
    this.name = name.trim();
    this.location = location.trim();
    this.areaHectares = Math.max(0, areaHectares);
    this.status = status.toLowerCase() === 'active' || status.toLowerCase() === 'completed' || status.toLowerCase() === 'paused' 
      ? status.toLowerCase() : 'planned';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Validation method
  validate(): boolean {
    if (!this.name || this.name.trim().length === 0) return false;
    if (!this.location || this.location.trim().length === 0) return false;
    if (this.areaHectares <= 0) return false;
    
    const validStatuses = ['planned', 'active', 'completed', 'paused'];
    if (!validStatuses.includes(this.status)) return false;

    return true;
  }

  // Convert to JSON serializable object
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      areaHectares: this.areaHectares,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
