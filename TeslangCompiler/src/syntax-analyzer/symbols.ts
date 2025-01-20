import {
  ExecutableStatement,
  Expression,
  IBinaryOperation,
  ICallExpression,
  ICodeBlock,
  IComment,
  ICoordinates,
  IdentifierType,
  IForLoop,
  IFunctionExpression,
  IIdentifier,
  IIfStatement,
  IIndexedAccess,
  IIndexedAssignment,
  IListLiteral,
  INotExpression,
  INumber,
  IOperator,
  IParameter,
  IReturn,
  Iterable,
  ITernaryOperation,
  IVariableAssignment,
  IVariableDefine,
  IVariableReference,
  IWhileLoop,
} from "../types.ts";


export class FunctionExpression implements IFunctionExpression {
  name: IIdentifier;
  type: IdentifierType;
  parameters: IParameter[];
  body: ICodeBlock;
  start: ICoordinates;

  constructor(
    name: IIdentifier,
    type: IdentifierType,
    parameters: IParameter[],
    body: ICodeBlock,
    start: ICoordinates
  ) {
    this.name = name;
    this.type = type;
    this.parameters = parameters;
    this.body = body;
    this.start = start;
  }
}

export class Parameter implements IParameter {
  name: IIdentifier;
  type: IdentifierType;
  start: ICoordinates;

  constructor(name: IIdentifier, type: IdentifierType, start: ICoordinates) {
    this.name = name;
    this.type = type;
    this.start = start;
  }
}

export class CodeBlock implements ICodeBlock {
  statements: ExecutableStatement[];
  start: ICoordinates;

  constructor(statements: ExecutableStatement[], start: ICoordinates) {
    this.statements = statements;
    this.start = start;
  }
}

export class Return implements IReturn {
  value: Expression;
  start: ICoordinates;

  constructor(value: Expression, start: ICoordinates) {
    this.value = value;
    this.start = start;
  }
}

export class VariableDefine implements IVariableDefine {
  name: IIdentifier;
  type: IdentifierType;
  start: ICoordinates;
  value?: Expression;

  constructor(
    name: IIdentifier,
    type: IdentifierType,
    start: ICoordinates,
    value?: Expression
  ) {
    this.name = name;
    this.type = type;
    this.start = start;
    this.value = value;
  }
}

export class VariableAssignment implements IVariableAssignment {
  name: IIdentifier;
  value: Expression;
  start: ICoordinates;

  constructor(name: IIdentifier, value: Expression, start: ICoordinates) {
    this.name = name;
    this.value = value;
    this.start = start;
  }
}

export class CallExpression implements ICallExpression {
  name: IIdentifier;
  arguments: Expression[];
  start: ICoordinates;

  constructor(
    name: IIdentifier,
    _arguments: Expression[],
    start: ICoordinates
  ) {
    this.name = name;
    this.arguments = _arguments;
    this.start = start;
  }
}

export class IndexedAccess implements IIndexedAccess {
  subject: Iterable;
  index: Expression;
  start: ICoordinates;

  constructor(subject: Iterable, index: Expression, start: ICoordinates) {
    this.subject = subject;
    this.index = index;
    this.start = start;
  }
}

export class IndexedAssignment implements IIndexedAssignment {
  indexedAccess: IndexedAccess;
  value: Expression;
  start: ICoordinates;

  constructor(
    indexedAccess: IndexedAccess,
    value: Expression,
    start: ICoordinates
  ) {
    this.indexedAccess = indexedAccess;
    this.value = value;
    this.start = start;
  }
}

export class IfStatement implements IIfStatement {
  condition: Expression;
  consequent: ICodeBlock;
  start: ICoordinates;
  alternate?: ICodeBlock;

  constructor(
    condition: Expression,
    consequent: ICodeBlock,
    start: ICoordinates,
    alternate?: ICodeBlock
  ) {
    this.condition = condition;
    this.consequent = consequent;
    this.start = start;
    this.alternate = alternate;
  }
}

export class ForLoop implements IForLoop {
  variable: IIdentifier;
  startNumber: Expression;
  endNumber: Expression;
  body: ICodeBlock;
  start: ICoordinates;

  constructor(
    variable: IIdentifier,
    startNumber: Expression,
    endNumber: Expression,
    body: ICodeBlock,
    start: ICoordinates
  ) {
    this.variable = variable;
    this.startNumber = startNumber;
    this.endNumber = endNumber;
    this.body = body;
    this.start = start;
  }
}

export class WhileLoop implements IWhileLoop {
  condition: Expression;
  body: ICodeBlock;
  start: ICoordinates;

  constructor(condition: Expression, body: ICodeBlock, start: ICoordinates) {
    this.condition = condition;
    this.body = body;
    this.start = start;
  }
}

export class TernaryOperation implements ITernaryOperation {
  condition: Expression;
  trueExpression: Expression;
  falseExpression: Expression;
  start: Coordinates;

  constructor(
    condition: Expression,
    trueExpression: Expression,
    falseExpression: Expression,
    start: Coordinates
  ) {
    this.condition = condition;
    this.trueExpression = trueExpression;
    this.falseExpression = falseExpression;
    this.start = start;
  }
}

export class NotExpression implements INotExpression {
  value: IBinaryOperation;
  start: ICoordinates;

  constructor(value: IBinaryOperation, start: ICoordinates) {
    this.value = value;
    this.start = start;
  }
}

export class BinaryOperation implements IBinaryOperation {
  operator: { value: IOperator };
  left: IBinaryOperation;
  right: IBinaryOperation;
  start: ICoordinates;

  constructor(
    operator: { value: IOperator },
    left: IBinaryOperation,
    right: IBinaryOperation,
    start: ICoordinates
  ) {
    this.operator = operator;
    this.left = left;
    this.right = right;
    this.start = start;
  }
}

export class VariableReference implements IVariableReference {
  name: IIdentifier;
  start: ICoordinates;

  constructor(name: IIdentifier, start: ICoordinates) {
    this.name = name;
    this.start = start;
  }
}

export class ListLiteral implements IListLiteral {
  items: Expression[];
  start: ICoordinates;

  constructor(items: Expression[], start: ICoordinates) {
    this.items = items;
    this.start = start;
  }
}

export class Identifier implements IIdentifier {
  name: string;
  start: ICoordinates;

  constructor(name: string, start: ICoordinates) {
    this.name = name;
    this.start = start;
  }
}

export class NumberSymbol implements INumber {
  value: number;
  start: ICoordinates;

  constructor(value: number, start: ICoordinates) {
    this.value = value;
    this.start = start;
  }
}

export class Comment implements IComment {
  value: string;
  start: ICoordinates;

  constructor(value: string, start: ICoordinates) {
    this.value = value.replace("//", "");
    this.start = start;
  }
}

export class Coordinates implements ICoordinates {
  line: number;
  col: number;

  constructor(line: number, col: number) {
    this.line = line;
    this.col = col;
  }
}
