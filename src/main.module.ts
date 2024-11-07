import { Module } from '@nestjs/common';
import { ParseDocumentModule } from './parse-document/parse-document.module';

@Module({
  imports: [ParseDocumentModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
