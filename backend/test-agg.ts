import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SourceEngineService } from './src/modules/source-engine/source-engine.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const s = app.get(SourceEngineService);
  await s.aggregateData();
  await app.close();
}
bootstrap();
