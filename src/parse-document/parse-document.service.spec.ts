import { Test, TestingModule } from '@nestjs/testing';
import { ParseDocumentService } from './parse-document.service';

describe('ParseDocumentService', () => {
  let service: ParseDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParseDocumentService],
    }).compile();

    service = module.get<ParseDocumentService>(ParseDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
