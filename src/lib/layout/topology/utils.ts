import { ParanoidOpts } from "src/lib/models";
import _ from "lodash";
import { getBottomOffset, prepareGetNodeTop } from "./get-node-coordinates";
import { traverseDF, TreeNode } from "../../tree";

export function getRightPoint(node: TreeNode) {
  const canvasNode = node.canvasNode as fabric.Object;

  return (canvasNode?.left || 0) + canvasNode?.getScaledWidth();
}

export function getNodeBottomCenter(node: TreeNode) {
  const canvasNode = node.canvasNode;

  if (canvasNode) {
    const left = canvasNode.left || 0;
    const bottom = (canvasNode.top || 0) + canvasNode.getScaledHeight();
    return {
      x: left + canvasNode.getScaledWidth() / 2,
      y: bottom,
    };
  }

  return { x: 0, y: 0 };
}

export function getNodeTopCenter(node: TreeNode) {
  const canvasNode = node.canvasNode;

  if (canvasNode) {
    const left = canvasNode.left || 0;
    const top = canvasNode.top || 0;
    return {
      x: left + canvasNode.getScaledWidth() / 2,
      y: top,
    };
  }

  return { x: 0, y: 0 };
}

function findCanvasNodesToShift(treeNode?: TreeNode) {
  let node = treeNode;
  const nodes: fabric.Group[] = [];

  while (node) {
    const siblings = _.get(node, ["parent", "children"], []) as TreeNode[];

    const index = siblings.findIndex(
      (c) => c.data.name === (node as TreeNode).data.name // eslint-disable-line
    ) as number;

    for (let i = index + 1; i < siblings.length; i++) {
      const sib = siblings[i];
      traverseDF(sib, (child) => {
        nodes.push(child.canvasNode as fabric.Group);
      });
    }

    node = node.parent;
  }

  return nodes;
}

export function getTreeMaxRight(node: TreeNode) {
  let currentNode = node;
  let right = 0;

  while (currentNode) {
    const canvasNode = node.canvasNode as fabric.Group;
    const currentRight = (canvasNode.left || 0) + canvasNode.getScaledWidth();
    if (currentRight > right) {
      right = currentRight;
    }
    currentNode = currentNode.children[currentNode.children.length - 1];
  }

  return right;
}

export function recalculatePositions(
  changedNode: TreeNode,
  { height }: { height: number; width: number },
  oldMaxRight: number,
  opts: ParanoidOpts
) {
  const canvasNode = changedNode.canvasNode as fabric.Object;
  const top =
    (canvasNode.top || 0) +
    height +
    getBottomOffset(changedNode.children.length);
  const getNodeTop = prepareGetNodeTop(opts.initialTop);
  const maxRight = getTreeMaxRight(changedNode);
  const widthOffset = maxRight - oldMaxRight;

  traverseDF(changedNode, (node) => {
    if (node.data.name === changedNode.data.name) {
      return;
    }

    const childCanvasNode = node.canvasNode as fabric.Object;
    if (_.get(node, ["parent", "data", "name"]) === changedNode.data.name) {
      childCanvasNode.set({
        top,
      });
    } else {
      childCanvasNode.set({
        top: getNodeTop(node),
      });
    }
    childCanvasNode.setCoords();
  });

  const nodes = findCanvasNodesToShift(changedNode);
  nodes.forEach((canvasNode) => {
    canvasNode.set({
      left: (canvasNode.left || 0) + widthOffset,
    });
    canvasNode.setCoords();
  });
}
