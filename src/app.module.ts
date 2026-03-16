import { Module } from '@nestjs/common';
import { MeetingModule } from './modules/meeting.module';

@Module({
  imports: [MeetingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
