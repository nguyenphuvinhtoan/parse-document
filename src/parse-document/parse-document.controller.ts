import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ParseDocumentService } from './parse-document.service';
import { ParseDocumentBodyDto, ParseDocumentResponseDto } from './dtos';
import { plainToInstance } from 'class-transformer';

@Controller('parse-document')
export class ParseDocumentController {
  constructor(private readonly parseDocumentService: ParseDocumentService) {}

  @Post()
  async parseDocument(
    @Body() dto: ParseDocumentBodyDto,
  ): Promise<ParseDocumentResponseDto> {
    try {
      const result = await this.parseDocumentService.parseDocument(dto);
      return plainToInstance(ParseDocumentResponseDto, result);
    } catch (error) {
      throw new HttpException(
        'Failed to parse document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
