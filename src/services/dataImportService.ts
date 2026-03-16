import { DataIngestionService } from './dataIngestionService';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { saveProject, saveUser } from '../storage/saveService';

export class DataImportService {
  private ingestionService: DataIngestionService;
  
  constructor() {
    this.ingestionService = new DataIngestionService();
  }
  
  async importFile(file: File): Promise<{ success: boolean; message: string; data?: any[] }> {
    try {
      const result = await this.ingestionService.ingestFile(file);
      
      if (!result.success) {
        return { 
          success: false, 
          message: `Import failed: ${result.errors.join(', ')}` 
        };
      }
      
      // Process the data based on expected format
      if (result.data && result.data.length > 0) {
        const firstRecord = result.data[0];
        
        // Determine type of data based on structure
        if (this.isProjectData(firstRecord)) {
          return await this.importProjects(result.data as any[]);
        } else if (this.isUserdata(firstRecord)) {
          return await this.importUsers(result.data as any[]);
        } else {
          // Generic data import - store as-is
          return { 
            success: true, 
            message: `Successfully imported ${result.data.length} records`, 
            data: result.data 
          };
        }
      }
      
      return { 
        success: true, 
        message: `Successfully imported 0 records` 
      };
    } catch (error) {
      console.error('Import error:', error);
      return { 
        success: false, 
        message: `Unexpected error during import: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
  
  private isProjectData(record: any): boolean {
    // Check for typical project fields
    const requiredFields = ['name', 'description', 'startDate', 'endDate', 'status'];
    return requiredFields.every(field => field in record);
  }
  
  private isUserdata(record: any): boolean {
    // Check for typical user fields
    const requiredFields = ['username', 'email', 'firstName', 'lastName', 'role'];
    return requiredFields.every(field => field in record);
  }
  
  private async importProjects(data: any[]): Promise<{ success: boolean; message: string; data?: any[] }> {
    const projects: Project[] = [];
    let errors = 0;
    
    for (const item of data) {
      try {
        // Map to Project model with proper type conversion
        const project = new Project(
          item.id || this.generateId(),
          item.name || '',
          item.description || '',
          item.startDate ? new Date(item.startDate) : null,
          item.endDate ? new Date(item.endDate) : null,
          item.status || 'draft',
          item.createdBy || '',
          Array.isArray(item.tags) ? item.tags : (item.tags ? item.tags.split(',').map(t => t.trim()) : []),
          item.metadata || {}
        );
        
        await saveProject(project);
        projects.push(project);
      } catch (error) {
        errors++;
        console.error(`Error importing project: ${item.name}`, error);
      }
    }
    
    return {
      success: true,
      message: `Successfully imported ${data.length - errors} projects. ${errors > 0 ? `${errors} failed.` : ''}`,
      data: projects
    };
  }
  
  private async importUsers(data: any[]): Promise<{ success: boolean; message: string; data?: any[] }> {
    const users: User[] = [];
    let errors = 0;
    
    for (const item of data) {
      try {
        // Map to User model with proper type conversion
        const user = new User(
          item.id || this.generateId(),
          item.username || '',
          item.email || '',
          item.firstName || '',
          item.lastName || '',
          item.role || 'user',
          item.avatarUrl || '',
          item.lastLogin ? new Date(item.lastLogin) : null
        );
        
        await saveUser(user);
        users.push(user);
      } catch (error) {
        errors++;
        console.error(`Error importing user: ${item.username}`, error);
      }
    }
    
    return {
      success: true,
      message: `Successfully imported ${data.length - errors} users. ${errors > 0 ? `${errors} failed.` : ''}`,
      data: users
    };
  }
  
  private generateId(): string {
    // Use crypto.randomUUID() if available, fallback to random string
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback for older environments
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
