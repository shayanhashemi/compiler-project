import { readFileSync } from "fs";
import Parser from "./syntax-analyzer/parser.ts";
import { SemanticChecker } from "./semantic-analyzer/checker.ts";
import { SemanticErrors } from "./semantic-analyzer/semantic-errors.ts";
import { formatSyntaxErrors } from "./syntax-analyzer/syntax-errors.ts";
import { ISyntaxError } from "./types";

function main() {
  try {
    const script = readFileSync(process.argv[2], {
      encoding: "utf8",
      flag: "r",
    });
    const errors = new SemanticErrors();
    const parser = new Parser(script, errors);
    const ast = parser.ast;
    const symbolTable = parser.generateSymbolTable();
    new SemanticChecker(ast, symbolTable, errors);
    errors.print();
  } catch (e: unknown) {
    const error = e as ISyntaxError;
    formatSyntaxErrors(error);
  }
}

main();
