@preprocessor typescript
@lexer lexer

@{%
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

%}

input
    -> program
        {% id %}

program
    -> statement_list
        {% id %}

statement_list
    -> statement _ statement_list
        {% data => [data[0], ...data[2]] %}
    | statement _
        {% data => [data[0]] %}


statement
    -> function_expression
        {% id %}
    | line_comment
        {% id %}

function_expression
    -> "fn" __ identifier _ %lparen _ parameter_list _ %rparen _ %lessThan _ type _ %greaterThan _ code_block
        {% data => new FunctionExpression(data[2], data[12].value, data[6], data[16], tokenStart(data[0])) %}

parameter_list
    -> null
        {% () => [] %}
    | parameter
        {% data => [data[0]] %}
    | parameter_list _ %comma _ parameter
        {% data => [...data[0], data[4]] %}

parameter
    -> identifier __ "as" __ type
        {% data => new Parameter(data[0], data[4].value, data[0].start) %}

code_block
    -> %lbrace _ block_statement_list _ %rbrace
        {% data => new CodeBlock(data[2], tokenStart(data[0])) %}

begin_end_code_block
    -> "begin" _ block_statement_list _ "end"
        {% data => new CodeBlock(data[2], tokenStart(data[0])) %}

block_statement_list
    -> block_statement _ block_statement_list
        {% data => [data[0], ...data[2]] %}
    | block_statement
        {% data => [data[0]] %}

block_statement
    -> return_statement _ %semicolon
        {% id %}
    | var_define _ %semicolon
        {% id %}
    | var_assignment _ %semicolon
        {% id %}
    | indexed_assignment _ %semicolon
        {% id %}
    | if_statement
    | for_loop 
        {% id %}
    | while_loop
        {% id %}
    | do_while_loop
        {% id %}
    | call_statement
        {% id %}
    | line_comment
        {% id %}


return_statement
    -> "return" _ expression
        {% data => new Return(data[2], tokenStart(data[0])) %}

var_define
    -> identifier _ %doubleColon _ type
        {% data => new VariableDefine(data[0], data[4], tokenStart(data[0])) %}
    | identifier _ %doubleColon _ type _ %assignment _ expression
        {% data => new VariableDefine(data[0], data[4].value, tokenStart(data[0]), data[8]) %}

var_assignment
    -> identifier _ %assignment _ expression
        {% data => new VariableAssignment(data[0], data[4], data[0].start) %}

call_statement
    -> call_expression
        {% id %}
    | call_expression _ %semicolon
        {% data => data[0] %}


call_expression
    -> identifier _ %lparen argument_list %rparen
        {% data => new CallExpression(data[0], data[3], data[0].start) %}

indexed_access
    -> identifier _ %lbracket _ expression _ %rbracket
        {% data => new IndexedAccess(data[0], data[4], data[0].start) %}

indexed_assignment
    -> indexed_access _ %assignment _ expression
        {% data => new IndexedAssignment(data[0], data[4], data[0].start) %}

if_statement
    -> "if" _ %doubleLBracket _ expression _ %doubleRBracket _ begin_end_code_block
        {% data => new IfStatement(data[4], data[8], tokenStart(data[0])) %}
    | "if" _ expression begin_end_code_block _ "else" _ begin_end_code_block
        {% data => new IfStatement(data[2], data[3], tokenStart(data[0]), data[7]) %}

for_loop
    -> "for" _ %lparen _ identifier _ %assignment _ expression __ "to" __ expression _ %rparen _ begin_end_code_block
        {% data => new ForLoop(data[4], data[8], data[12], data[16], tokenStart(data[0])) %}

while_loop
    -> "while" _ %lparen _ expression _ %rparen _ begin_end_code_block
        {% data => new WhileLoop(data[4], data[8], tokenStart(data[0])) %}

do_while_loop
    -> "do" _ begin_end_code_block _ "while" _ %lparen _ expression _ %rparen _
        {% data => new WhileLoop(data[8], data[2], tokenStart(data[0])) %}

argument_list
    -> null
        {% () => [] %}
    |  _ expression _
        {% data => [data[1]] %}
    |  _ expression _ %comma argument_list
        {% data => [data[1], ...data[4]] %}

type
    -> "int"
        {% id %}
    | "vector"
        {% id %}
    | "str"
        {% id %}
    | "null"
        {% id %}

expression
    -> ternary_expression
        {% id %}

ternary_expression
    -> boolean_expression _ "?" _ expression _ ":" _ expression
        {% data => new TernaryOperation(data[0], data[4], data[8], tokenStart(data[0])) %}
    | boolean_expression
        {% id %}

boolean_expression
    -> comparison_expression
    | boolean_expression _ boolean_operator _ comparison_expression
        {% data => new BinaryOperation(data[2], data[0], data[4], tokenStart(data[0])) %}

boolean_operator
    -> %and
        {% id %}
    | %or
        {% id %}

comparison_expression
    -> additive_expression
    | comparison_expression _ comparison_operator _ additive_expression
        {% data => new BinaryOperation(data[2], data[0], data[4], tokenStart(data[0])) %}

comparison_operator
    -> %greaterThan
        {% id %}
    | %greaterThanEqual
        {% id %}
    | %lessThan
        {% id %}
    | %lessThanEqual
        {% id %}
    | %equality
        {% id %}
    | %notEqual
        {% id %}

additive_expression
    -> multiplicative_expression
    | additive_expression _ [+-] _ multiplicative_expression
        {% data => new BinaryOperation(data[2], data[0], data[4], tokenStart(data[0])) %}

multiplicative_expression
    -> unary_expression
    | multiplicative_expression _ [*/] _ unary_expression
        {% data => new BinaryOperation(data[2], data[0], data[4], tokenStart(data[0])) %}

unary_expression
    -> number
    | identifier
    | call_expression
    | %lparen _ expression _ %rparen
        {% data => data[2] %}

line_comment
    -> %comment
        {% data => new Comment(data[0].value, tokenStart(data[0])) %}

number
    -> %number
        {% data => new NumberSymbol(parseInt(data[0].value), tokenStart(data[0])) %}

identifier
    -> %identifier
        {% data => new Identifier(data[0].value, tokenStart(data[0])) %}

_ -> %ws:*
__ -> %ws:+