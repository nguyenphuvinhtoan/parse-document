import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ParseDocumentService } from './parse-document.service';
import { ParseDocumentDto } from './dtos';

@Controller('parse-document')
export class ParseDocumentController {
  constructor(private readonly parseDocumentService: ParseDocumentService) {}

  @Post()
  async parseDocument(@Body() dto: ParseDocumentDto) {
    try {
      const result = await this.parseDocumentService.parseDocument(dto);
      return { result };
    } catch (error) {
      throw new HttpException(
        'Failed to parse document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
