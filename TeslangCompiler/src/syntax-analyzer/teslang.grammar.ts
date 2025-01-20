// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var lparen: any;
declare var rparen: any;
declare var lessThan: any;
declare var greaterThan: any;
declare var comma: any;
declare var lbrace: any;
declare var rbrace: any;
declare var semicolon: any;
declare var doubleColon: any;
declare var assignment: any;
declare var lbracket: any;
declare var rbracket: any;
declare var doubleLBracket: any;
declare var doubleRBracket: any;
declare var and: any;
declare var or: any;
declare var greaterThanEqual: any;
declare var lessThanEqual: any;
declare var equality: any;
declare var notEqual: any;
declare var comment: any;
declare var number: any;
declare var identifier: any;
declare var ws: any;

import {lexer} from "../lexical-analyzer/lexer.ts";
import {
    BinaryOperation,
    CallExpression,
    CodeBlock,
    Comment,
    ForLoop,
    WhileLoop,
    FunctionExpression,
    Identifier,
    IfStatement,
    IndexedAccess,
    IndexedAssignment,
    ListLiteral,
    NotExpression,
    NumberSymbol,
    Parameter,
    Return,
    VariableAssignment,
    VariableDefine,
    VariableReference,
    Coordinates,
    TernaryOperation
} from "./symbols.ts";

function tokenStart(token: any) {
    return  new Coordinates(token.line, token.col - 1);
}

function convertToken(token: any) {
    return {
        type: token.type,
        value: token.value,
        start: tokenStart(token)
    };
}


interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "input", "symbols": ["program"], "postprocess": id},
    {"name": "program", "symbols": ["statement_list"], "postprocess": id},
    {"name": "statement_list", "symbols": ["statement", "_", "statement_list"], "postprocess": data => [data[0], ...data[2]]},
    {"name": "statement_list", "symbols": ["statement", "_"], "postprocess": data => [data[0]]},
    {"name": "statement", "symbols": ["function_expression"], "postprocess": id},
    {"name": "statement", "symbols": ["line_comment"], "postprocess": id},
    {"name": "function_expression", "symbols": [{"literal":"fn"}, "__", "identifier", "_", (lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "parameter_list", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen), "_", (lexer.has("lessThan") ? {type: "lessThan"} : lessThan), "_", "type", "_", (lexer.has("greaterThan") ? {type: "greaterThan"} : greaterThan), "_", "code_block"], "postprocess": data => new FunctionExpression(data[2], data[12].value, data[6], data[16], tokenStart(data[0]))},
    {"name": "parameter_list", "symbols": [], "postprocess": () => []},
    {"name": "parameter_list", "symbols": ["parameter"], "postprocess": data => [data[0]]},
    {"name": "parameter_list", "symbols": ["parameter_list", "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "parameter"], "postprocess": data => [...data[0], data[4]]},
    {"name": "parameter", "symbols": ["identifier", "__", {"literal":"as"}, "__", "type"], "postprocess": data => new Parameter(data[0], data[4].value, data[0].start)},
    {"name": "code_block", "symbols": [(lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_", "block_statement_list", "_", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace)], "postprocess": data => new CodeBlock(data[2], tokenStart(data[0]))},
    {"name": "begin_end_code_block", "symbols": [{"literal":"begin"}, "_", "block_statement_list", "_", {"literal":"end"}], "postprocess": data => new CodeBlock(data[2], tokenStart(data[0]))},
    {"name": "block_statement_list", "symbols": ["block_statement", "_", "block_statement_list"], "postprocess": data => [data[0], ...data[2]]},
    {"name": "block_statement_list", "symbols": ["block_statement"], "postprocess": data => [data[0]]},
    {"name": "block_statement", "symbols": ["return_statement", "_", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon)], "postprocess": id},
    {"name": "block_statement", "symbols": ["var_define", "_", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon)], "postprocess": id},
    {"name": "block_statement", "symbols": ["var_assignment", "_", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon)], "postprocess": id},
    {"name": "block_statement", "symbols": ["indexed_assignment", "_", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon)], "postprocess": id},
    {"name": "block_statement", "symbols": ["if_statement"]},
    {"name": "block_statement", "symbols": ["for_loop"], "postprocess": id},
    {"name": "block_statement", "symbols": ["while_loop"], "postprocess": id},
    {"name": "block_statement", "symbols": ["do_while_loop"], "postprocess": id},
    {"name": "block_statement", "symbols": ["call_statement"], "postprocess": id},
    {"name": "block_statement", "symbols": ["line_comment"], "postprocess": id},
    {"name": "return_statement", "symbols": [{"literal":"return"}, "_", "expression"], "postprocess": data => new Return(data[2], tokenStart(data[0]))},
    {"name": "var_define", "symbols": ["identifier", "_", (lexer.has("doubleColon") ? {type: "doubleColon"} : doubleColon), "_", "type"], "postprocess": data => new VariableDefine(data[0], data[4], tokenStart(data[0]))},
    {"name": "var_define", "symbols": ["identifier", "_", (lexer.has("doubleColon") ? {type: "doubleColon"} : doubleColon), "_", "type", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "expression"], "postprocess": data => new VariableDefine(data[0], data[4].value, tokenStart(data[0]), data[8])},
    {"name": "var_assignment", "symbols": ["identifier", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "expression"], "postprocess": data => new VariableAssignment(data[0], data[4], data[0].start)},
    {"name": "call_statement", "symbols": ["call_expression"], "postprocess": id},
    {"name": "call_statement", "symbols": ["call_expression", "_", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon)], "postprocess": data => data[0]},
    {"name": "call_expression", "symbols": ["identifier", "_", (lexer.has("lparen") ? {type: "lparen"} : lparen), "argument_list", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": data => new CallExpression(data[0], data[3], data[0].start)},
    {"name": "indexed_access", "symbols": ["identifier", "_", (lexer.has("lbracket") ? {type: "lbracket"} : lbracket), "_", "expression", "_", (lexer.has("rbracket") ? {type: "rbracket"} : rbracket)], "postprocess": data => new IndexedAccess(data[0], data[4], data[0].start)},
    {"name": "indexed_assignment", "symbols": ["indexed_access", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "expression"], "postprocess": data => new IndexedAssignment(data[0], data[4], data[0].start)},
    {"name": "if_statement", "symbols": [{"literal":"if"}, "_", (lexer.has("doubleLBracket") ? {type: "doubleLBracket"} : doubleLBracket), "_", "expression", "_", (lexer.has("doubleRBracket") ? {type: "doubleRBracket"} : doubleRBracket), "_", "begin_end_code_block"], "postprocess": data => new IfStatement(data[4], data[8], tokenStart(data[0]))},
    {"name": "if_statement", "symbols": [{"literal":"if"}, "_", "expression", "begin_end_code_block", "_", {"literal":"else"}, "_", "begin_end_code_block"], "postprocess": data => new IfStatement(data[2], data[3], tokenStart(data[0]), data[7])},
    {"name": "for_loop", "symbols": [{"literal":"for"}, "_", (lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "identifier", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "expression", "__", {"literal":"to"}, "__", "expression", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen), "_", "begin_end_code_block"], "postprocess": data => new ForLoop(data[4], data[8], data[12], data[16], tokenStart(data[0]))},
    {"name": "while_loop", "symbols": [{"literal":"while"}, "_", (lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "expression", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen), "_", "begin_end_code_block"], "postprocess": data => new WhileLoop(data[4], data[8], tokenStart(data[0]))},
    {"name": "do_while_loop", "symbols": [{"literal":"do"}, "_", "begin_end_code_block", "_", {"literal":"while"}, "_", (lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "expression", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen), "_"], "postprocess": data => new WhileLoop(data[8], data[2], tokenStart(data[0]))},
    {"name": "argument_list", "symbols": [], "postprocess": () => []},
    {"name": "argument_list", "symbols": ["_", "expression", "_"], "postprocess": data => [data[1]]},
    {"name": "argument_list", "symbols": ["_", "expression", "_", (lexer.has("comma") ? {type: "comma"} : comma), "argument_list"], "postprocess": data => [data[1], ...data[4]]},
    {"name": "type", "symbols": [{"literal":"int"}], "postprocess": id},
    {"name": "type", "symbols": [{"literal":"vector"}], "postprocess": id},
    {"name": "type", "symbols": [{"literal":"str"}], "postprocess": id},
    {"name": "type", "symbols": [{"literal":"null"}], "postprocess": id},
    {"name": "expression", "symbols": ["ternary_expression"], "postprocess": id},
    {"name": "ternary_expression", "symbols": ["boolean_expression", "_", {"literal":"?"}, "_", "expression", "_", {"literal":":"}, "_", "expression"], "postprocess": data => new TernaryOperation(data[0], data[4], data[8], tokenStart(data[0]))},
    {"name": "ternary_expression", "symbols": ["boolean_expression"], "postprocess": id},
    {"name": "boolean_expression", "symbols": ["comparison_expression"]},
    {"name": "boolean_expression", "symbols": ["boolean_expression", "_", "boolean_operator", "_", "comparison_expression"], "postprocess": data => new BinaryOperation(data[2], data[0], data[4], tokenStart(data[0]))},
    {"name": "boolean_operator", "symbols": [(lexer.has("and") ? {type: "and"} : and)], "postprocess": id},
    {"name": "boolean_operator", "symbols": [(lexer.has("or") ? {type: "or"} : or)], "postprocess": id},
    {"name": "comparison_expression", "symbols": ["additive_expression"]},
    {"name": "comparison_expression", "symbols": ["comparison_expression", "_", "comparison_operator", "_", "additive_expression"], "postprocess": data => new BinaryOperation(data[2], data[0], data[4], tokenStart(data[0]))},
    {"name": "comparison_operator", "symbols": [(lexer.has("greaterThan") ? {type: "greaterThan"} : greaterThan)], "postprocess": id},
    {"name": "comparison_operator", "symbols": [(lexer.has("greaterThanEqual") ? {type: "greaterThanEqual"} : greaterThanEqual)], "postprocess": id},
    {"name": "comparison_operator", "symbols": [(lexer.has("lessThan") ? {type: "lessThan"} : lessThan)], "postprocess": id},
    {"name": "comparison_operator", "symbols": [(lexer.has("lessThanEqual") ? {type: "lessThanEqual"} : lessThanEqual)], "postprocess": id},
    {"name": "comparison_operator", "symbols": [(lexer.has("equality") ? {type: "equality"} : equality)], "postprocess": id},
    {"name": "comparison_operator", "symbols": [(lexer.has("notEqual") ? {type: "notEqual"} : notEqual)], "postprocess": id},
    {"name": "additive_expression", "symbols": ["multiplicative_expression"]},
    {"name": "additive_expression", "symbols": ["additive_expression", "_", /[+-]/, "_", "multiplicative_expression"], "postprocess": data => new BinaryOperation(data[2], data[0], data[4], tokenStart(data[0]))},
    {"name": "multiplicative_expression", "symbols": ["unary_expression"]},
    {"name": "multiplicative_expression", "symbols": ["multiplicative_expression", "_", /[*/]/, "_", "unary_expression"], "postprocess": data => new BinaryOperation(data[2], data[0], data[4], tokenStart(data[0]))},
    {"name": "unary_expression", "symbols": ["number"]},
    {"name": "unary_expression", "symbols": ["identifier"]},
    {"name": "unary_expression", "symbols": ["call_expression"]},
    {"name": "unary_expression", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "expression", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": data => data[2]},
    {"name": "line_comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": data => new Comment(data[0].value, tokenStart(data[0]))},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": data => new NumberSymbol(parseInt(data[0].value), tokenStart(data[0]))},
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": data => new Identifier(data[0].value, tokenStart(data[0]))},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"]}
  ],
  ParserStart: "input",
};

export default grammar;
