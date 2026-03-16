import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MeetingService } from './services/meetingService';
import { Inject } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication if needed
  app.enableCors();
  
  await app.listen(3000);
  
  // Schedule the sprint review meeting on startup as a one-time action
  const meetingService = app.get(MeetingService);
  console.log('Scheduling sprint review meeting...');
  console.log(meetingService.scheduleSprintReview());
}

bootstrap();
