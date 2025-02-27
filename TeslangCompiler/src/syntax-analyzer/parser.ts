import nearley from "nearley";
import grammar from "./teslang.grammar.ts";
import { ICodeBlock, Table, AST, IFunctionExpression } from "../types.ts";
import { SymbolTable } from "./symbol-table.ts";
import {
  Coordinates,
  ForLoop,
  FunctionExpression,
  Identifier,
  IfStatement,
  Parameter,
  VariableDefine,
  WhileLoop,
} from "./symbols.ts";
import { SemanticErrors } from "../semantic-analyzer/semantic-errors.ts";

export default class Parser {
  private readonly _script: string;
  private errors: SemanticErrors;
  private readonly _grammar: nearley.CompiledRules;
  private readonly _ast: AST;
  private readonly _symbolTable: SymbolTable;

  constructor(script: string, errors: SemanticErrors) {
    this._script = script;
    this.errors = errors;
    this._grammar = grammar;
    this._symbolTable = new SymbolTable();
    const compiledGrammar: nearley.Grammar = nearley.Grammar.fromCompiled(
      this._grammar
    );
    const parser = new nearley.Parser(compiledGrammar);
    parser.feed(this._script);
    const results = parser.results;
    
    if (results.length > 1)
      throw new Error(
        `Language Design Error: Ambiguous Grammar! Generated ${results.length}) ASTs`
      );
    if (results.length === 0) {
      throw new Error(
        "Unexpected end of Input error. Incomplete Teslang program. Expected more input"
      );
    }
    this._ast = parser.results[0];
  }

  get ast(): AST {
    return this._ast;
  }

  generateSymbolTable(): SymbolTable {
    this.addBuiltInFunctions(this._symbolTable.rootTable);
    for (const node of this.ast) {
      if (node instanceof FunctionExpression) {
        this.checkFunction(node, this._symbolTable.rootTable);
      }
    }
    return this._symbolTable;
  }

  private addBuiltInFunctions(table: Table) {
    const dummyCoordinate = new Coordinates(-1, -1);
    this._symbolTable.put(
      table,
      "scan",
      "BuiltInFunction",
      dummyCoordinate,
      [],
      "void"
    );
    this._symbolTable.put(
      table,
      "print",
      "BuiltInFunction",
      dummyCoordinate,
      [
        new Parameter(
          new Identifier("n", dummyCoordinate),
          "int",
          dummyCoordinate
        ),
      ],
      "void"
    );
    this._symbolTable.put(
      table,
      "list",
      "BuiltInFunction",
      dummyCoordinate,
      [
        new Parameter(
          new Identifier("n", dummyCoordinate),
          "int",
          dummyCoordinate
        ),
      ],
      "vector"
    );
    this._symbolTable.put(
      table,
      "length",
      "BuiltInFunction",
      dummyCoordinate,
      [
        new Parameter(
          new Identifier("arr", dummyCoordinate),
          "int",
          dummyCoordinate
        ),
      ],
      "int"
    );
    this._symbolTable.put(
      table,
      "exit",
      "BuiltInFunction",
      dummyCoordinate,
      [
        new Parameter(
          new Identifier("n", dummyCoordinate),
          "int",
          dummyCoordinate
        ),
      ],
      "void"
    );
  }

  private checkFunction(node: IFunctionExpression, table: Table) {
    const functionExpression = this._symbolTable.get(node.name.name);
    if (functionExpression) {
      if (functionExpression.type === "BuiltInFunction") {
        this.errors.add(
          node.start.line,
          node.start.col,
          `function "${functionExpression.name}" is a builtin function and can not be redefined`
        );
      } else {
        this.errors.add(
          node.start.line,
          node.start.col,
          `function "${functionExpression.name}" is already defined at line ${functionExpression.start.line} col ${functionExpression.start.col}`
        );
      }
    } else {
      this._symbolTable.put(
        table,
        node.name.name,
        "Function",
        node.start,
        node.parameters,
        node.type
      );
      const childTable = this._symbolTable.createTableNode(table);
      for (const parameter of node.parameters) {
        this._symbolTable.put(
          childTable,
          parameter.name.name,
          parameter.type,
          parameter.start
        );
      }
      this.checkCodeBlock(node.body, childTable);
    }
  }

  private checkCodeBlock(node: ICodeBlock, table: Table) {
    for (const statement of node.statements) {
      if (statement instanceof VariableDefine) {
        if (this._symbolTable.containsInTable(statement.name.name, table)) {
          const variableDefine = this._symbolTable.get(statement.name.name);
          if (variableDefine) {
            this.errors.add(
              statement.start.line,
              statement.start.col,
              `"${variableDefine.name}" is already defined at line ${variableDefine.start.line} col ${variableDefine.start.col}`
            );
          }
        } else {
          this._symbolTable.put(
            table,
            statement.name.name,
            statement.type,
            statement.start
          );
        }
      } else if (statement instanceof WhileLoop) {
        const whileLoopTable = this._symbolTable.createTableNode(table);
        this.checkCodeBlock(statement.body, whileLoopTable);
      } else if (statement instanceof IfStatement) {
        const IfStatementTable = this._symbolTable.createTableNode(table);
        this.checkCodeBlock(statement.consequent, IfStatementTable);
      } else if (statement instanceof ForLoop) {
        const forLoopTable = this._symbolTable.createTableNode(table);
        this._symbolTable.put(
          forLoopTable,
          statement.variable.name,
          "int",
          statement.variable.start
        );
        this._symbolTable.put(
          forLoopTable,
          statement.variable.name,
          "int",
          statement.variable.start
        );
        this.checkCodeBlock(statement.body, forLoopTable);
      }
    }
  }
}
