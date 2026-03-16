import { Project } from '../models/Project';
import { ProjectTimelineModel } from '../models/ProjectTimeline';
import { ProjectTimelineService } from './projectTimelineService';

export class InitTimelineService {
  private timelineService: ProjectTimelineService;

  constructor() {
    this.timelineService = new ProjectTimelineService();
  }

  async initializeDefaultTimeline(projectId: string, projectName: string): Promise<ProjectTimelineModel> {
    // Create default timeline with common milestones
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6); // 6 months from now
    
    const defaultMilestones: Omit<ProjectTimelineModel['milestones'][number], 'id'>[] = [
      {
        name: 'Project Kickoff',
        description: 'Initial meeting to define scope, goals and team roles',
        dueDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from start
        status: 'planned',
        priority: 'high',
        dependencies: []
      },
      {
        name: 'Requirements Finalized',
        description: 'All requirements documented and approved by stakeholders',
        dueDate: new Date(startDate.getTime() + 2 * 7 * 24 * 60 * 60 * 1000), // 2 weeks from start
        status: 'planned',
        priority: 'high',
        dependencies: []
      },
      {
        name: 'Design Approved',
        description: 'UI/UX designs reviewed and approved by stakeholders',
        dueDate: new Date(startDate.getTime() + 4 * 7 * 24 * 60 * 60 * 1000), // 4 weeks from start
        status: 'planned',
        priority: 'medium',
        dependencies: ['Requirements Finalized']
      },
      {
        name: 'Development Complete',
        description: 'All core features implemented and tested',
        dueDate: new Date(startDate.getTime() + 12 * 7 * 24 * 60 * 60 * 1000), // 3 months from start
        status: 'planned',
        priority: 'high',
        dependencies: ['Design Approved']
      },
      {
        name: 'User Testing Phase',
        description: 'Beta testing with target users and feedback collection',
        dueDate: new Date(startDate.getTime() + 14 * 7 * 24 * 60 * 60 * 1000), // 3.5 months from start
        status: 'planned',
        priority: 'medium',
        dependencies: ['Development Complete']
      },
      {
        name: 'Launch Ready',
        description: 'Final QA, documentation and deployment prep complete',
        dueDate: new Date(startDate.getTime() + 18 * 7 * 24 * 60 * 60 * 1000), // 4.5 months from start
        status: 'planned',
        priority: 'high',
        dependencies: ['User Testing Phase']
      },
      {
        name: 'Project Launch',
        description: 'Official launch to production and stakeholders',
        dueDate: endDate,
        status: 'planned',
        priority: 'high',
        dependencies: ['Launch Ready']
      }
    ];

    const timeline = await this.timelineService.createTimeline(projectId, {
      projectId,
      name: `${projectName} Timeline`,
      description: `Default project timeline for ${projectName}`,
      startDate,
      endDate,
      milestones: defaultMilestones,
      status: 'active',
      timelineType: 'custom'
    });

    return timeline;
  }

  async initializeFromMondayCom(projectId: string, mondayData: any): Promise<ProjectTimelineModel> {
    // Validate required fields
    if (!mondayData.name || !mondayData.startDate || !mondayData.endDate) {
      throw new Error('Monday.com data must include name, startDate, and endDate');
    }
    
    // Convert Monday.com data to our format
    const startDate = new Date(mondayData.startDate);
    const endDate = new Date(mondayData.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format in Monday.com data');
    }
    
    const milestones = mondayData.items?.map((item: any) => ({
      name: item.name || 'Unnamed milestone',
      description: item.description || '',
      dueDate: new Date(item.due_date),
      status: this.mapStatusFromMondayCom(item.status),
      priority: (item.priority && ['low', 'medium', 'high'].includes(item.priority)) ? 
        item.priority as 'low' | 'medium' | 'high' : 'medium',
      assignee: item.assignee || undefined
    })) || [];

    return await this.timelineService.createTimeline(projectId, {
      projectId,
      name: mondayData.name,
      description: mondayData.description || '',
      startDate,
      endDate,
      milestones,
      status: 'active',
      timelineType: 'monday.com'
    });
  }

  async initializeFromJira(projectId: string, jiraData: any): Promise<ProjectTimelineModel> {
    // Validate required fields
    if (!jiraData.name || !jiraData.startDate || !jiraData.endDate) {
      throw new Error('Jira data must include name, startDate, and endDate');
    }
    
    const startDate = new Date(jiraData.startDate);
    const endDate = new Date(jiraData.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format in Jira data');
    }
    
    const milestones = jiraData.issues?.map((issue: any) => ({
      name: issue.summary || 'Unnamed task',
      description: issue.description || '',
      dueDate: new Date(issue.dueDate),
      status: this.mapStatusFromJira(issue.status),
      priority: (issue.priority && ['low', 'medium', 'high'].includes(issue.priority.toLowerCase())) ? 
        issue.priority.toLowerCase() as 'low' | 'medium' | 'high' : 'medium',
      assignee: issue.assignee || undefined
    })) || [];

    return await this.timelineService.createTimeline(projectId, {
      projectId,
      name: jiraData.name,
      description: jiraData.description || '',
      startDate,
      endDate,
      milestones,
      status: 'active',
      timelineType: 'jira'
    });
  }

  private mapStatusFromMondayCom(status: string): Milestone['status'] {
    const mapping: Record<string, Milestone['status']> = {
      'To do': 'planned',
      'In progress': 'in-progress',
      'Done': 'completed',
      'Blocked': 'blocked'
    };
    return mapping[status] || 'planned';
  }

  private mapStatusFromJira(status: string): Milestone['status'] {
    const mapping: Record<string, Milestone['status']> = {
      'To Do': 'planned',
      'In Progress': 'in-progress',
      'Done': 'completed',
      'Blocked': 'blocked'
    };
    return mapping[status] || 'planned';
  }
}
