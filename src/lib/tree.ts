import { fabric } from "fabric";
import { Source } from "./parser";

export class TreeNode<T = Source> {
  data: T;
  children: TreeNode<T>[] = [];
  parent?: TreeNode<T>;

  // TODO: refactor this so it always has value
  canvasNode?: fabric.Object;
  shapeInstance?: any;

  // trees inside this node
  members: Tree<T>[] = [];

  constructor(data: T, canvasNode?: fabric.Object) {
    this.data = data;
    this.canvasNode = canvasNode;
  }

  add(data: T, canvasNode?: fabric.Object) {
    const child = new TreeNode(data, canvasNode);
    child.addParent(this);
    this.children.push(child);
  }

  addNode(node: TreeNode<T>) {
    node.addParent(this);
    this.children.push(node);
  }

  addNodes(nodes: TreeNode<T>[]) {
    nodes.forEach((node) => {
      node.addParent(this);
    });
    this.children = this.children.concat(nodes);
  }

  addCanvasNode(canvasNode: fabric.Object) {
    this.canvasNode = canvasNode;
  }

  addShapeInstance(instance: any) {
    this.shapeInstance = instance;
  }

  hasChildren() {
    return this.children.length > 0;
  }

  addParent(parent: TreeNode<T>) {
    this.parent = parent;
  }

  getLeftSibling() {
    if (!this.parent) {
      return undefined;
    }
    const index = this.parent.children.findIndex((child) => child === this);

    return this.parent.children[index - 1];
  }

  getRightSibling() {
    if (!this.parent) {
      return undefined;
    }
    const index = this.parent.children.findIndex((child) => child === this);

    return this.parent.children[index + 1];
  }
}

export function traverseDF(
  root: TreeNode,
  fn: (node: TreeNode, leaf: boolean) => void
) {
  const children = [root];
  while (children.length) {
    const node = children.shift();
    let leaf = false;
    if (node) {
      if (node.children.length > 0) {
        children.unshift(...node.children);
      } else {
        leaf = true;
      }
      fn(node, leaf);
    }
  }
}

export function traverseLeftBranch(
  root: TreeNode,
  fn: (node: TreeNode, leaf: boolean) => void
) {
  const children = [root];
  while (children.length) {
    const node = children.shift();
    if (node) {
      if (node.children.length > 0) {
        children.unshift(...node.children);
        fn(node, false);
      } else {
        fn(node, true);
        break;
      }
    }
  }
}

export function findMostleftLeaf(root: TreeNode) {
  let currentNode = root;
  traverseLeftBranch(root, (node) => {
    currentNode = node;
  });

  return currentNode;
}

export function findMostrightLeaf(root: TreeNode) {
  let child = root;

  while (child.children[child.children.length - 1]) {
    child = child.children[child.children.length - 1];
  }

  return child;
}

export class Tree<T = Source> {
  root: TreeNode<T>;
  canvas?: fabric.Canvas;
  // This property is required to support node children out of parent's group. Look at 'PostgreSQL Replicas from master' story.
  nodesWithChildren: string[] = [];

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

  traverseDF(fn: (node: TreeNode<T>, leaf: boolean) => void) {
    const children = [this.root];
    while (children.length) {
      const node = children.shift();
      let leaf = false;
      if (node) {
        if (node.children.length > 0) {
          children.unshift(...node.children);
        } else {
          leaf = true;
        }
        fn(node, leaf);
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

  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  setNodesWithChildren(nodesWitchChildren: string[]) {
    this.nodesWithChildren = nodesWitchChildren;
  }
}
