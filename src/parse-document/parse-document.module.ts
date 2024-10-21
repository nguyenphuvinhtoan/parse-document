import { Module } from '@nestjs/common';
import { ParseDocumentController } from './parse-document.controller';
import { ParseDocumentService } from './parse-document.service';
import { InstructionBuilder } from './instruction-builder';

@Module({
  controllers: [ParseDocumentController],
  providers: [ParseDocumentService, InstructionBuilder],
})
export class ParseDocumentModule {}
