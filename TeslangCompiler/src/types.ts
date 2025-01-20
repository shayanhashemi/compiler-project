import { TreeNode } from "./utils/tree.ts";

export type IdentifierType =
  | "int"
  | "vector"
  | "str"
  | "null"
  | "BuiltInFunction"
  | "Function"
  | "void";

export type IOperator = "&&" | "||" | "<" | ">" | "==" | "<=" | ">=" | "!=";

export type ExecutableStatement =
  | IReturn
  | IVariableDefine
  | IVariableAssignment
  | ICallExpression
  | IIndexedAssignment
  | IIfStatement
  | IForLoop;

export type Expression = INotExpression | IBinaryOperation | ITernaryOperation;

export type UnaryExpression =
  | INumber
  | IVariableReference
  | ICallExpression
  | IListLiteral
  | IIndexedAccess;
export type Table = TreeNode<Map<string, ISymbolNode>>;

export type AST = (IFunctionExpression | IComment)[];

export type Iterable = IVariableReference | ICallExpression;

export interface ICoordinates {
  line: number;
  col: number;
}

export interface IFunctionExpression {
  name: IIdentifier;
  type: IdentifierType;
  parameters: IParameter[];
  body: ICodeBlock;
  start: ICoordinates;
}

export interface IParameter {
  name: IIdentifier;
  type: IdentifierType;
  start: ICoordinates;
}

export interface ICodeBlock {
  statements: ExecutableStatement[];
  start: ICoordinates;
}

export interface IReturn {
  value: Expression;
  start: ICoordinates;
}

export interface IVariableDefine {
  name: IIdentifier;
  type: IdentifierType;
  start: ICoordinates;
  value?: Expression;
}

export interface IVariableAssignment {
  name: IIdentifier;
  value: Expression;
  start: ICoordinates;
}

export interface ICallExpression {
  name: IIdentifier;
  arguments: any[];
  start: ICoordinates;
}

export interface IIndexedAccess {
  subject: Iterable;
  index: Expression;
  start: ICoordinates;
}

export interface IIndexedAssignment {
  indexedAccess: IIndexedAccess;
  value: Expression;
  start: ICoordinates;
}

export interface IWhileLoop {
  condition: Expression;
  body: ICodeBlock;
  start: ICoordinates;
}

export interface IIfStatement {
  condition: Expression;
  consequent: ICodeBlock;
  start: ICoordinates;
  alternate?: ICodeBlock;
}

export interface IForLoop {
  variable: IIdentifier;
  startNumber: Expression;
  endNumber: Expression;
  body: ICodeBlock;
  start: ICoordinates;
}

export interface ITernaryOperation {
  condition: Expression;
  trueExpression: Expression;
  falseExpression: Expression;
  start: ICoordinates;
}

export interface INotExpression {
  value: IBinaryOperation;
  start: ICoordinates;
}

export interface IBinaryOperation {
  operator: { value: IOperator };
  left: IBinaryOperation;
  right: IBinaryOperation;
  start: ICoordinates;
}

export interface IVariableReference {
  name: IIdentifier;
  start: ICoordinates;
}

export interface IListLiteral {
  items: Expression[];
  start: ICoordinates;
}

export interface IIdentifier {
  name: string;
  start: ICoordinates;
}

export interface INumber {
  value: number;
  start: ICoordinates;
}

export interface IString {
  value: string;
  start: ICoordinates;
}

export interface IComment {
  value: string;
  start: ICoordinates;
}

export interface ISymbolNode {
  name: string;
  type: IdentifierType;
  start: ICoordinates;
  parameters?: IParameter[];
  returnType?: IdentifierType;
}

export interface ISyntaxError {
  token: { type: string; value: string; line: number; col: number };
  message: string;
}
