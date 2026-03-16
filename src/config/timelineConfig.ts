import { ProjectTimelineModel } from '../models/ProjectTimeline';

export const defaultProjectTimelines: Partial<ProjectTimelineModel>[] = [
  {
    name: 'Farm Management System - Phase 1',
    description: 'Core functionality for farm operations management',
    projectId: 'farm-system-v1',
    startDate: new Date(2024, 0, 15), // Jan 15, 2024
    endDate: new Date(2024, 5, 30),   // Jun 30, 2024
    status: 'active',
    milestones: [
      {
        name: 'Database Schema Design',
        description: 'Complete database schema for all farm entities',
        dueDate: new Date(2024, 1, 15),
        status: 'completed',
        priority: 'high',
        associatedTasks: ['schema-design-1', 'schema-review-1']
      },
      {
        name: 'User Authentication System',
        description: 'Implement secure user login and role-based access control',
        dueDate: new Date(2024, 1, 29),
        status: 'completed',
        priority: 'high',
        associatedTasks: ['auth-implementation', 'auth-testing']
      },
      {
        name: 'Data Import Module',
        description: 'Develop import functionality for CSV/Excel farm data',
        dueDate: new Date(2024, 2, 15),
        status: 'in-progress',
        priority: 'medium',
        associatedTasks: ['import-module', 'validation-rules']
      },
      {
        name: 'Farm Scene Implementation',
        description: 'Create interactive farm visualization with animals and crops',
        dueDate: new Date(2024, 3, 15),
        status: 'planned',
        priority: 'high',
        associatedTasks: ['farm-scene-1', 'scene-testing']
      },
      {
        name: 'Reporting Dashboard',
        description: 'Build comprehensive analytics dashboard with charts and metrics',
        dueDate: new Date(2024, 5, 1),
        status: 'planned',
        priority: 'high',
        associatedTasks: ['dashboard-design', 'chart-lib-integration']
      }
    ]
  },
  {
    name: 'Farm Management System - Phase 2',
    description: 'Advanced features for farm optimization and automation',
    projectId: 'farm-system-v2',
    startDate: new Date(2024, 6, 1),   // Jul 1, 2024
    endDate: new Date(2024, 11, 31),  // Dec 31, 2024
    status: 'planned',
    milestones: [
      {
        name: 'IoT Integration',
        description: 'Connect sensors for soil moisture, temperature, and humidity',
        dueDate: new Date(2024, 7, 15),
        status: 'planned',
        priority: 'high',
        associatedTasks: ['iot-hardware', 'sensor-api']
      },
      {
        name: 'Automated Irrigation System',
        description: 'Implement automated watering based on sensor data',
        dueDate: new Date(2024, 8, 15),
        status: 'planned',
        priority: 'high',
        associatedTasks: ['irrigation-logic', 'control-system']
      },
      {
        name: 'Crop Yield Prediction',
        description: 'Develop ML model to predict crop yields based on historical data',
        dueDate: new Date(2024, 9, 15),
        status: 'planned',
        priority: 'medium',
        associatedTasks: ['ml-model', 'data-training']
      },
      {
        name: 'Mobile Application',
        description: 'Create iOS and Android apps for farm management on the go',
        dueDate: new Date(2024, 10, 30),
        status: 'planned',
        priority: 'high',
        associatedTasks: ['mobile-app-design', 'app-development']
      },
      {
        name: 'Final Testing & Deployment',
        description: 'Comprehensive testing and production deployment',
        dueDate: new Date(2024, 11, 15),
        status: 'planned',
        priority: 'high',
        associatedTasks: ['qa-testing', 'deployment']
      }
    ]
  }
];
