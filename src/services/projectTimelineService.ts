import { ProjectTimelineModel, Milestone } from '../models/ProjectTimeline';
import { Project } from '../models/Project';
import { DexieService } from '../storage/dexie';

export class ProjectTimelineService {
  private db: DexieService;

  constructor() {
    this.db = new DexieService();
  }

  async createTimeline(projectId: string, timelineData: Omit<ProjectTimelineModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectTimelineModel> {
    const timeline = new ProjectTimelineModel({
      ...timelineData,
      projectId,
      milestones: timelineData.milestones || []
    });
    
    await this.db.save('ProjectTimeline', timeline);
    return timeline;
  }

  async getTimelineById(id: string): Promise<ProjectTimelineModel | null> {
    return this.db.get('ProjectTimeline', id) as Promise<ProjectTimelineModel | null>;
  }

  async getAllTimelinesByProject(projectId: string): Promise<ProjectTimelineModel[]> {
    const timelines = await this.db.getAll('ProjectTimeline');
    return timelines.filter(t => t.projectId === projectId);
  }

  async updateTimeline(id: string, updates: Partial<ProjectTimelineModel>): Promise<boolean> {
    const timeline = await this.getTimelineById(id);
    if (!timeline) return false;
    
    // Handle date conversions
    if (updates.startDate) timeline.startDate = new Date(updates.startDate);
    if (updates.endDate) timeline.endDate = new Date(updates.endDate);
    
    Object.assign(timeline, updates);
    
    return await this.db.update('ProjectTimeline', timeline);
  }

  async deleteTimeline(id: string): Promise<boolean> {
    return await this.db.delete('ProjectTimeline', id);
  }

  async addMilestone(timelineId: string, milestoneData: Omit<Milestone, 'id'>): Promise<Milestone> {
    const timeline = await this.getTimelineById(timelineId);
    if (!timeline) throw new Error('Timeline not found');
    
    try {
      const milestone = timeline.addMilestone(milestoneData);
      await this.db.update('ProjectTimeline', timeline);
      return milestone;
    } catch (error) {
      throw new Error(`Failed to add milestone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateMilestone(timelineId: string, milestoneId: string, updates: Partial<Milestone>): Promise<boolean> {
    const timeline = await this.getTimelineById(timelineId);
    if (!timeline) throw new Error('Timeline not found');
    
    try {
      const updated = timeline.updateMilestone(milestoneId, updates);
      if (updated) {
        await this.db.update('ProjectTimeline', timeline);
      }
      return updated;
    } catch (error) {
      throw new Error(`Failed to update milestone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteMilestone(timelineId: string, milestoneId: string): Promise<boolean> {
    const timeline = await this.getTimelineById(timelineId);
    if (!timeline) throw new Error('Timeline not found');
    
    const deleted = timeline.deleteMilestone(milestoneId);
    if (deleted) {
      await this.db.update('ProjectTimeline', timeline);
    }
    return deleted;
  }

  async getMilestonesByStatus(timelineId: string, status: Milestone['status']): Promise<Milestone[]> {
    const timeline = await this.getTimelineById(timelineId);
    if (!timeline) throw new Error('Timeline not found');
    
    return timeline.getMilestonesByStatus(status);
  }

  async getProjectProgress(projectId: string): Promise<number> {
    const timelines = await this.getAllTimelinesByProject(projectId);
    if (timelines.length === 0) return 0;
    
    // Average progress across all timelines
    const totalProgress = timelines.reduce((sum, timeline) => sum + timeline.getProgress(), 0);
    return Math.round(totalProgress / timelines.length);
  }

  async exportToMondayCom(timelineId: string): Promise<any> {
    const timeline = await this.getTimelineById(timelineId);
    if (!timeline) throw new Error('Timeline not found');
    
    // Structure for Monday.com API
    return {
      name: timeline.name,
      description: timeline.description,
      startDate: timeline.startDate.toISOString(),
      endDate: timeline.endDate.toISOString(),
      items: timeline.milestones.map(milestone => ({
        name: milestone.name,
        description: milestone.description,
        due_date: milestone.dueDate.toISOString(),
        status: this.mapStatusToMondayCom(milestone.status),
        assignee: milestone.assignee || '',
        priority: milestone.priority
      })),
      timelineType: 'monday.com'
    };
  }

  async exportToJira(timelineId: string): Promise<any> {
    const timeline = await this.getTimelineById(timelineId);
    if (!timeline) throw new Error('Timeline not found');
    
    // Structure for Jira API
    return {
      name: timeline.name,
      description: timeline.description,
      startDate: timeline.startDate.toISOString(),
      endDate: timeline.endDate.toISOString(),
      issues: timeline.milestones.map(milestone => ({
        summary: milestone.name,
        description: milestone.description,
        dueDate: milestone.dueDate.toISOString(),
        status: this.mapStatusToJira(milestone.status),
        assignee: milestone.assignee || '',
        priority: milestone.priority.toUpperCase(),
        issueType: 'Task',
        labels: ['milestone']
      })),
      timelineType: 'jira'
    };
  }

  private mapStatusToMondayCom(status: Milestone['status']): string {
    const mapping: Record<Milestone['status'], string> = {
      'planned': 'To do',
      'in-progress': 'In progress',
      'completed': 'Done',
      'blocked': 'Blocked'
    };
    return mapping[status] || 'To do';
  }

  private mapStatusToJira(status: Milestone['status']): string {
    const mapping: Record<Milestone['status'], string> = {
      'planned': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Done',
      'blocked': 'Blocked'
    };
    return mapping[status] || 'To Do';
  }
}
