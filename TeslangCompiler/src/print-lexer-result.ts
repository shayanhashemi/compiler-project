import { readFileSync } from "fs";
import { lexer } from "./lexical-analyzer/lexer.ts";
import { formatSyntaxErrors } from "./syntax-analyzer/syntax-errors.ts";
import { ISyntaxError } from "./types";

function PrintLexerResult() {
  try {
    const script = readFileSync(process.argv[2], {
      encoding: "utf8",
      flag: "r",
    });

    lexer.reset(script);

    console.log("| Line | Column | Type             | Value                |");
    console.log("|------|--------|------------------|----------------------|");

    while (true) {
      const token = lexer.next();
      if (!token) break;
      if (token.type === "ws" || token.type === "nl") continue;
      console.log(
        `| ${token.line.toString().padStart(4)} | ${token.col
          .toString()
          .padStart(6)} | ${token?.type
          ?.toUpperCase()
          .padEnd(16)} | ${token.value.padEnd(20)} |`
      );
    }
  } catch (e: unknown) {
    const error = e as ISyntaxError;
    formatSyntaxErrors(error);
  }
}

PrintLexerResult();
