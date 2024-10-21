import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParseDocumentModule } from './parse-document/parse-document.module';

@Module({
  imports: [ParseDocumentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
