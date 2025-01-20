import chalk from 'chalk';

export class SemanticErrors {
  private readonly errors: string[];

  constructor() {
    this.errors = [];
  }

  add(line: number, col: number, error: string) {
    this.errors.push(`line ${line} col ${col + 1} : ${error}`);
  }

  print() {
    if (this.errors.length > 0) {
      console.log(chalk.red('Semantic Errors at :'));
      for (const error of this.errors) {
      console.log(chalk.red(`    ${error}`));
      }
    }
  }
}
