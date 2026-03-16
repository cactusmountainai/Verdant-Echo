import { Injectable } from '@nestjs/common';

interface MeetingInfo {
  title: string;
  date: Date;
  attendees: string[];
  agenda: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

@Injectable()
export class MeetingService {
  private meetings: MeetingInfo[] = [];

  scheduleSprintReview(): string {
    const meeting: MeetingInfo = {
      title: "Sprint Review: GOAL.md Deliverables Validation",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      attendees: [
        "Product Owner",
        "Scrum Master",
        "Development Team",
        "Stakeholders"
      ],
      agenda: [
        "Review completed deliverables against GOAL.md",
        "Demonstrate implemented features",
        "Discuss blockers and impediments",
        "Gather stakeholder feedback",
        "Plan next sprint priorities"
      ],
      status: 'scheduled'
    };

    this.meetings.push(meeting);
    
    return `Sprint review meeting scheduled for ${meeting.date.toLocaleDateString()} with attendees: ${meeting.attendees.join(', ')}`;
  }

  getPendingMeetings(): MeetingInfo[] {
    return this.meetings.filter(m => m.status === 'scheduled');
  }
}
