import { TreeNode } from "../../tree";

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
