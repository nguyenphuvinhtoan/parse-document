import { readFileSync } from 'fs';
import * as path from 'path';

export class InstructionBuilder {
  private instructions: { [key: string]: string };

  constructor() {
    this.instructions = {
      cv: this.buildCVInstruction(),
      jd: this.buildJDInstruction(),
    };
  }

  buildCVInstruction() {
    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'src',
      'parse-document',
      'template',
      'cv_template.yml',
    );
    const template = readFileSync(templatePath, 'utf8');
    return `To complete this task, you need to parse a CV file in the data directory and extract specific details. Here are the step-by-step instructions:
1. Load the CV file: The file is located in the data directory. Access it and load the content.
2. Extract all information base on this template with example:
${template}
3. If and fields don't have information, only leave blank.
4. Output in JSON format.
5. Keep only the JSON in the response
Ensure that the output does not contain any XML tags and is presented in a clear and structured manner.`;
  }

  buildJDInstruction() {
    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'src',
      'parse-document',
      'template',
      'jd_template.yml',
    );
    const template = readFileSync(templatePath, 'utf8');
    return `To complete this task, you need to parse a JD file in the data directory and extract specific details. Here are the step-by-step instructions:
1. Load the JD file: The file is located in the data directory. Access it and load the content.
2. Extract all information base on this template with example:
${template}
3. If and fields don't have information, only leave blank.
4. Output in JSON format.
5. Keep only the JSON in the response
Ensure that the output does not contain any XML tags and is presented in a clear and structured manner.`;
  }

  getInstruction(type) {
    return this.instructions[type] || '';
  }
}

export default InstructionBuilder;
