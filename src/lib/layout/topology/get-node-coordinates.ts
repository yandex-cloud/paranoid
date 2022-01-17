import { fabric } from "fabric";
import { findMostrightLeaf, TreeNode, findMostleftLeaf } from "../../tree";
import { getRightPoint } from "./utils";

export const LEFT_OFFSET = 16;
export const BOTTOM_OFFSET = 16;
export const BOTTOM_OFFSET_WITH_MULTIPLE_CHILDREN = 24;

export function getBottomOffset(childrenCount: number) {
  switch (childrenCount) {
    case 0:
      return 0;
    case 1:
      return BOTTOM_OFFSET;
    default:
      return BOTTOM_OFFSET_WITH_MULTIPLE_CHILDREN;
  }
}

export function prepareGetNodeTop(initialTop: number) {
  // TODO implement top cache with invalidation
  return function (node: TreeNode) {
    let top = initialTop;
    if (!node.parent) {
      return top;
    }

    let currentNode: TreeNode | undefined = node;

    while (currentNode) {
      const parent: TreeNode | undefined = currentNode.parent;
      if (parent && parent.canvasNode) {
        const offset = getBottomOffset(parent.children.length);
        top += offset + parent.canvasNode.getScaledHeight();
      }

      currentNode = parent;
    }

    return top;
  };
}

function getParentCenteredCoords(node: TreeNode) {
  const childMostright = findMostrightLeaf(node);
  const childMostleft = findMostleftLeaf(node);
  const x1 = childMostleft.canvasNode?.left || 0;
  const x2 = getRightPoint(childMostright);
  const canvasNode = node.canvasNode as fabric.Object;

  const width = canvasNode.getScaledWidth();

  return (
    (x1 + x2) / 2 - // center of children widths summ
    width / 2
  );
}

export function prepareGetNodeLeft() {
  // TODO implement left cache with invalidation
  return function (node: TreeNode, leftOffset: number) {
    const left = leftOffset;
    const leftSibling = node.getLeftSibling();

    if (!leftSibling && node.children.length === 0) {
      // left leaf
      return left;
    } else if (leftSibling && node.children.length === 0) {
      const siblingMostright = findMostrightLeaf(leftSibling);
      return getRightPoint(siblingMostright) + LEFT_OFFSET;
    } else if (node.children.length === 1) {
      // parent
      if (leftSibling) {
        return getParentCenteredCoords(node);
      }

      const child = node.children[0];
      const canvasNode = child.canvasNode as fabric.Object;
      return canvasNode.left || 0;
    } else if (node.children.length > 1) {
      // parent
      return getParentCenteredCoords(node);
    }

    return left;
  };
}
