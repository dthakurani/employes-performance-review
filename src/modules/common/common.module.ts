import { Global, Module } from '@nestjs/common';
import { CommonHelper } from './common.helper';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [CommonHelper],
  exports: [CommonHelper],
})
export class CommonModule {}
