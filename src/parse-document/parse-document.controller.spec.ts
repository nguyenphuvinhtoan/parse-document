import { Test, TestingModule } from '@nestjs/testing';
import { ParseDocumentController } from './parse-document.controller';

describe('ParseDocumentController', () => {
  let controller: ParseDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParseDocumentController],
    }).compile();

    controller = module.get<ParseDocumentController>(ParseDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
