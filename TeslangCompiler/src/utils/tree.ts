export class TreeNode<T> {
  model: T;
  children: TreeNode<T>[];
  parent: TreeNode<T> | null;

  constructor(model: T, parent: TreeNode<T> | null = null) {
    this.model = model;
    this.children = [];
    this.parent = parent;
  }

  addChild(childModel: T): TreeNode<T> {
    const childNode = new TreeNode(childModel, this);
    this.children.push(childNode);
    return childNode;
  }

  find(predicate: (node: TreeNode<T>) => boolean): TreeNode<T> | null {
    if (predicate(this)) {
      return this;
    }
    for (const child of this.children) {
      const result = child.find(predicate);
      if (result) return result;
    }
    return null;
  }
}

export class Tree<T> {
  root: TreeNode<T>;

  constructor(rootModel: T) {
    this.root = new TreeNode(rootModel);
  }

  find(predicate: (node: TreeNode<T>) => boolean): TreeNode<T> | null {
    return this.root.find(predicate);
  }
}
