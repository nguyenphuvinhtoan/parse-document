import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { InstructionBuilder } from './instruction-builder';
import { ParseDocumentDto } from './dtos';

@Injectable()
export class ParseDocumentService {
  private client: OpenAI;
  private instructionBuilder: InstructionBuilder;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.instructionBuilder = new InstructionBuilder();
  }

  async parseDocument(dto: ParseDocumentDto): Promise<string> {
    try {
      const localFilePath = path.resolve(
        __dirname,
        '..',
        '..',
        'src',
        'parse-document',
        'tmp',
        `${dto.documentType}_${Date.now()}.pdf`,
      );
      await this.downloadFile(dto.documentUrl, localFilePath);

      // Create PDF assistant
      const pdfAssistant = await this.client.beta.assistants.create({
        model: 'gpt-4o',
        instructions: this.instructionBuilder.getInstruction(dto.documentType),
        tools: [{ type: 'file_search' }],
        name: `${dto.documentType.toUpperCase()} Parse Assistant`,
      });

      // Create thread
      const thread = await this.client.beta.threads.create();

      // Upload file
      const file = await this.client.files.create({
        file: fs.createReadStream(localFilePath),
        purpose: 'assistants',
      });

      // Create message in thread
      await this.client.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: dto.prompt,
        attachments: [{ file_id: file.id, tools: [{ type: 'file_search' }] }],
      });

      // Run thread
      const run = await this.client.beta.threads.runs.create(thread.id, {
        assistant_id: pdfAssistant.id,
      });

      // Poll for completion
      let runStatus: OpenAI.Beta.Threads.Runs.Run;
      do {
        runStatus = await this.client.beta.threads.runs.retrieve(
          thread.id,
          run.id,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
      } while (runStatus.status !== 'completed');

      if (runStatus.status !== 'completed') {
        throw new Error(`Run failed: ${runStatus.status}`);
      }

      // Retrieve messages
      const messages = await this.client.beta.threads.messages.list(thread.id);
      // Output text
      const resTxt =
        messages.data[0].content[0].type === 'text'
          ? messages.data[0].content[0].text.value
          : '';

      // Clean up temporary file if it was downloaded
      if (dto.documentUrl.startsWith('http')) {
        fs.unlink(localFilePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      }

      return resTxt;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }

  private downloadFile(url: string, localPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(localPath);
      https
        .get(url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close(() => resolve());
          });
        })
        .on('error', (err) => {
          fs.unlink(localPath, () => reject(err));
        });
    });
  }
}
