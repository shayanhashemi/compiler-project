import chalk from 'chalk';
import { ISyntaxError } from "../types.ts";

export function formatSyntaxErrors(error: ISyntaxError) {
  console.log(error);
  
  const token = error.token;
  const message = error.message;
  const matchResult = message.match(/(?<=A ).*(?= based on:)/g);
  const expected = matchResult
    ? matchResult.map((s: string) => s.replace(/\s+token/i, ""))
    : [];
  if (expected.indexOf("ws") > -1 && expected.length > 2) {
    expected.splice(expected.indexOf("ws"), 1);
  } else if (expected.indexOf("ws") > -1 && expected.length > 1) {
    expected.splice(expected.indexOf("ws"), 1);
  }

  for (const i in expected) {
    if (expected[i] === "ws") {
      expected[i] = "white space";
    }
  }
  let unexpected: string;
  if (token?.type === "ws") {
    unexpected = "white space";
  } else {
    unexpected = token.value;
  }
  let newMessage = "    ";
  if (expected && expected.length) {
    newMessage += `expected ${[
      ...new Set(expected),
    ]} but got ${unexpected} instead`;
  } else {
    newMessage += `Unexpected ${unexpected}`;
  }
  console.log(
    chalk.red(`Syntax Error at line ${token.line} col ${token.col} :`)
  );
  console.log(chalk.red(newMessage));
}
