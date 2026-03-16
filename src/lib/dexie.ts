import Dexie from 'dexie';

interface Project {
  id?: number;
  name: string;
  startDate: number; // timestamp
  endDate: number | null;
  status: 'active' | 'completed' | 'paused';
}

interface Meeting {
  id?: number;
  projectId: number;
  title: string;
  time: number; // timestamp
  notes: string;
}

class AppDatabase extends Dexie {
  projects!: Dexie.Table<Project, number>;
  meetings!: Dexie.Table<Meeting, number>;

  constructor() {
    super('FarmDB');
    this.version(1).stores({
      projects: '++id, name, status',
      meetings: '++id, projectId, time',
    });
  }
}

export const db = new AppDatabase();

export async function addProject(project: Omit<Project, 'id'>): Promise<number> {
  return await db.projects.add(project);
}

export async function getProjects(): Promise<Project[]> {
  return await db.projects.toArray();
}

export async function addMeeting(meeting: Omit<Meeting, 'id'>): Promise<number> {
  return await db.meetings.add(meeting);
}

export async function getMeetingsByProject(projectId: number): Promise<Meeting[]> {
  return await db.meetings.where('projectId').equals(projectId).toArray();
}
