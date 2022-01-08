import { fabric } from "fabric";

export class TreeNode<T> {
  data: T;
  canvasNode?: fabric.Object;
  children: TreeNode<T>[] = [];

  // trees inside this node
  members: Tree<T>[] = [];

  constructor(data: T, canvasNode?: fabric.Object) {
    this.data = data;
    this.canvasNode = canvasNode;
  }

  add(data: T, canvasNode?: fabric.Object) {
    this.children.push(new TreeNode(data, canvasNode));
  }

  addNode(node: TreeNode<T>) {
    this.children.push(node);
  }

  addNodes(nodes: TreeNode<T>[]) {
    this.children = this.children.concat(nodes);
  }

  addCanvasNode(canvasNode: fabric.Object) {
    this.canvasNode = canvasNode;
  }

  hasChildren() {
    return this.children.length > 0;
  }
}

export default class Tree<T> {
  root: TreeNode<T>;

  constructor(rootNode: TreeNode<T>) {
    this.root = rootNode;
  }

  traverseBF(fn: (node: TreeNode<T>) => void) {
    const children = [this.root];

    while (children.length > 0) {
      const node = children.shift();

      if (node) {
        children.push(...node.children);
        fn(node);
      }
    }
  }

  traverseByLevels(fn: (nodes: TreeNode<T>[], level: number) => void) {
    let level = 0;
    let children = this.root.children;

    fn([this.root], 0);

    while (children.length > 0) {
      level++;
      fn(children, level);
      children = children.reduce(
        (acc, node) => acc.concat(node.children),
        [] as TreeNode<T>[]
      );
    }
  }

  getTreeDepth() {
    let level = 0;
    this.traverseByLevels((_, l) => {
      level = l;
    });

    return level;
  }
}
