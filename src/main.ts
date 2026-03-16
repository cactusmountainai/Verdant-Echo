import { createApp } from 'vue';
import App from './app.module.vue';
import { projectTimelineService } from './services/projectTimelineService';
import { initializeTimelineService } from './services/initTimelineService';

// Initialize timeline service before app creation (awaited)
async function bootstrap() {
  await initializeTimelineService();
  
  const app = createApp(App);
  app.mount('#app');
}

bootstrap();
