import { BaseModel } from './BaseModel';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[];
}

export interface ProjectTimeline extends BaseModel {
  projectId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  timelineType: 'monday.com' | 'jira' | 'custom';
}

export class ProjectTimelineModel extends BaseModel implements ProjectTimeline {
  projectId: string = '';
  name: string = '';
  description: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  milestones: Milestone[] = [];
  status: 'active' | 'completed' | 'on-hold' | 'cancelled' = 'active';
  timelineType: 'monday.com' | 'jira' | 'custom' = 'custom';

  constructor(data?: Partial<ProjectTimeline>) {
    super();
    if (data) {
      Object.assign(this, data);
      this.startDate = new Date(data.startDate);
      this.endDate = new Date(data.endDate);
      this.milestones = data.milestones?.map(m => ({
        ...m,
        dueDate: new Date(m.dueDate)
      })) || [];
    }
  }

  generateId(): string {
    return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addMilestone(milestone: Omit<Milestone, 'id'>): Milestone {
    // Validate dependencies
    if (milestone.dependencies && milestone.dependencies.length > 0) {
      const invalidDeps = milestone.dependencies.filter(depId => 
        !this.milestones.some(m => m.id === depId)
      );
      if (invalidDeps.length > 0) {
        throw new Error(`Invalid dependencies: ${invalidDeps.join(', ')}`);
      }
    }

    const newMilestone: Milestone = {
      id: this.generateId(),
      ...milestone,
      dueDate: milestone.dueDate instanceof Date ? milestone.dueDate : new Date(milestone.dueDate)
    };
    this.milestones.push(newMilestone);
    return newMilestone;
  }

  updateMilestone(id: string, updates: Partial<Milestone>): boolean {
    const index = this.milestones.findIndex(m => m.id === id);
    if (index !== -1) {
      // Validate dependencies if they're being updated
      if ('dependencies' in updates && updates.dependencies) {
        const invalidDeps = updates.dependencies.filter(depId => 
          !this.milestones.some(m => m.id === depId) && m.id !== id
        );
        if (invalidDeps.length > 0) {
          throw new Error(`Invalid dependencies: ${invalidDeps.join(', ')}`);
        }
      }

      Object.assign(this.milestones[index], updates);
      if (updates.dueDate) {
        this.milestones[index].dueDate = updates.dueDate instanceof Date ? updates.dueDate : new Date(updates.dueDate);
      }
      return true;
    }
    return false;
  }

  deleteMilestone(id: string): boolean {
    const index = this.milestones.findIndex(m => m.id === id);
    if (index !== -1) {
      // Remove this milestone from any other milestones' dependencies
      this.milestones.forEach(m => {
        if (m.dependencies && m.dependencies.includes(id)) {
          m.dependencies = m.dependencies.filter(depId => depId !== id);
        }
      });
      
      this.milestones.splice(index, 1);
      return true;
    }
    return false;
  }

  getMilestonesByStatus(status: Milestone['status']): Milestone[] {
    return this.milestones.filter(m => m.status === status);
  }

  getProgress(): number {
    const total = this.milestones.length;
    if (total === 0) return 0;
    const completed = this.milestones.filter(m => m.status === 'completed').length;
    return Math.round((completed / total) * 100);
  }
}
