import { Module } from '@nestjs/common';
import { SourceEngineService } from './source-engine.service';

@Module({
  providers: [SourceEngineService]
})
export class SourceEngineModule {}
