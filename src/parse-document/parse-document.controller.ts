import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ParseDocumentService } from './parse-document.service';

@Controller('parse-document')
export class ParseDocumentController {
  constructor(private readonly parseDocumentService: ParseDocumentService) {}

  @Post()
  async parseDocument(
    @Body()
    body: {
      documentType: string;
      fileUrl: string;
      prompt: string;
    },
  ) {
    try {
      const { documentType, fileUrl, prompt } = body;
      const result = await this.parseDocumentService.parseDocument(
        documentType,
        fileUrl,
        prompt,
      );
      return { result };
    } catch (error) {
      throw new HttpException(
        'Failed to parse document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
