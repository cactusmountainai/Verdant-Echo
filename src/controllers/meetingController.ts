import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MeetingService } from '../services/meetingService';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post('/schedule-sprint-review')
  @HttpCode(HttpStatus.OK)
  scheduleSprintReview(@Res() res: Response) {
    const result = this.meetingService.scheduleSprintReview();
    return res.status(HttpStatus.OK).json({ message: result });
  }

  @Get('/pending')
  @HttpCode(HttpStatus.OK)
  getPendingMeetings(@Res() res: Response) {
    const pending = this.meetingService.getPendingMeetings();
    return res.status(HttpStatus.OK).json({ pendingMeetings: pending });
  }
}
