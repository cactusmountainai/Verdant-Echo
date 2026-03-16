import { Module } from '@nestjs/common';
import { MeetingController } from '../controllers/meetingController';
import { MeetingService } from '../services/meetingService';

@Module({
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService]
})
export class MeetingModule {}
