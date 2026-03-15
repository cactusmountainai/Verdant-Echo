export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string; // foreign key to User.id
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'active' | 'archived';
  metadata?: Record<string, any>; // for game-specific config (e.g., level data, settings)
}

export class ProjectEntity implements Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'active' | 'archived';
  metadata?: Record<string, any>;

  constructor(data: Omit<Project, 'createdAt' | 'updatedAt'>) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.ownerId = data.ownerId;
    this.status = data.status || 'draft';
    this.metadata = data.metadata;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  update(data: Partial<Project>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }
}
