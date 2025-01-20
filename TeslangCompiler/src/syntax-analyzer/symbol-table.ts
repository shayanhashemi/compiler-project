import {
  ICoordinates,
  IdentifierType,
  IParameter,
  ISymbolNode,
  Table,
} from "../types.ts";
import { Tree } from "../utils/tree.ts";

export class SymbolNode implements ISymbolNode {
  name: string;
  type: IdentifierType;
  start: ICoordinates;
  parameters?: IParameter[];
  returnType?: IdentifierType;

  constructor(
    name: string,
    type: IdentifierType,
    start: ICoordinates,
    parameters?: IParameter[],
    returnType?: IdentifierType
  ) {
    this.name = name;
    this.type = type;
    this.start = start;
    this.parameters = parameters;
    this.returnType = returnType;
  }
}

export class SymbolTable {
  private _tables: Tree<Map<string, ISymbolNode>>;
  private readonly _rootTable: Table;

  constructor() {
    const rootModel = new Map<string, ISymbolNode>();
    this._tables = new Tree(rootModel);
    this._rootTable = this._tables.root;
  }

  createTableNode(parentTable: Table): Table {
    const newModel = new Map<string, ISymbolNode>();
    return parentTable.addChild(newModel);
  }

  put(
    table: Table,
    name: string,
    type: IdentifierType,
    start: ICoordinates,
    parameters?: IParameter[],
    returnType?: IdentifierType
  ) {
    if (table.model.has(name)) {
      return false;
    } else {
      const node = new SymbolNode(name, type, start, parameters, returnType);
      table.model.set(name, node);
      return true;
    }
  }

  get(name: string): ISymbolNode | undefined {
    const foundNode = this._tables.root.find((node) => node.model.has(name));
    return foundNode?.model.get(name);
  }

  hasAccess(name: string, table: Table): boolean {
    if (table.model.has(name)) {
      return true;
    } else if (table.parent) {
      return this.hasAccess(name, table.parent);
    }
    return false;
  }

  containsInTable(name: string, table: Table): boolean {
    return table.model.has(name);
  }

  get rootTable() {
    return this._rootTable;
  }
}
