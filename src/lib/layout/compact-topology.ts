import { fabric } from "fabric";

import { Tree, TreeNode } from "../tree";
import { ParanoidOpts, GraphNode } from "../models";
import { GraphGroupNode } from "../parser";

import renderNode from "../compact-topology/shapes/node";
import renderGroup from "../compact-topology/shapes/group";
import { GroupSizes } from "../compact-topology/shapes/constants";

const left0 = 10;
const top0 = 10;
export const NODE_MARGIN_BOTTOM = 15;
export const NODE_MARGIN_RIGHT = 40;

function getHeightsSum(arr: fabric.Object[]) {
  return arr.reduce((acc, object) => acc + object.getScaledHeight() || 0, 0);
}

export function getCanvasObjects(
  tree: Tree,
  treeTop = top0,
  treeLeft = left0,
  opts: ParanoidOpts
) {
  const top = treeTop;
  const left = treeLeft;
  const nodes: fabric.Object[] = [];
  const groupMembers: fabric.Object[] = [];

  let maxHeight = 0;
  let maxWidth = 0;
  tree.traverseByLevels((treeNodes, level) => {
    const objectsAtCurrentLevel: fabric.Object[] = [];
    let levelHeight = 0;
    let levelWidth = 0;

    const canvasObjects = treeNodes.map((treeNode, i) => {
      const leftOffset = left + NODE_MARGIN_RIGHT * level + maxWidth;

      const topOffset =
        top + getHeightsSum(objectsAtCurrentLevel) + NODE_MARGIN_BOTTOM * i;

      const { object, membersObjects } = getCanvasObject(
        tree.canvas as fabric.Canvas,
        topOffset,
        leftOffset,
        treeNode,
        opts,
        tree.nodesWithChildren
      );

      if (membersObjects.length > 0) {
        groupMembers.push(...membersObjects);
      }
      levelHeight += object.getScaledHeight() + NODE_MARGIN_BOTTOM;

      const nodeWidth = object.getScaledWidth();

      if (nodeWidth > levelWidth) {
        levelWidth = nodeWidth;
      }

      treeNode.addCanvasNode(object);
      objectsAtCurrentLevel.push(object);
      return object;
    });
    nodes.push(...canvasObjects);
    nodes.push(...groupMembers);

    levelHeight -= NODE_MARGIN_BOTTOM;

    // calculate level's max width & height
    maxWidth += levelWidth;

    if (levelHeight > maxHeight) {
      maxHeight = levelHeight;
    }
  });
  const summNodeMargins = tree.getTreeDepth() * NODE_MARGIN_RIGHT;
  const treeBottom = maxHeight + top;
  const treeRight = maxWidth + left + summNodeMargins;

  return { nodes, bottom: treeBottom, right: treeRight };
}

export function getCanvasObject(
  canvas: fabric.Canvas,
  top: number,
  left: number,
  node: TreeNode,
  opts: ParanoidOpts,
  nodesWithChildren: string[]
) {
  let canvasObject: fabric.Object;
  const membersObjects: fabric.Object[] = [];

  const group = node.data as GraphGroupNode;
  if (node.members.length > 0) {
    // groups have padding
    const membersLeft = left + GroupSizes.paddingRight;
    let membersTop =
      top +
      GroupSizes.paddingTop +
      GroupSizes.paddingTop +
      GroupSizes.paddingBottom; // title paddings;

    // get edge coords of group members
    let maxBottom = 0;
    let maxRight = 0;
    const objects = node.members.reduce((acc, memberTree) => {
      memberTree.setCanvas(canvas);
      memberTree.setNodesWithChildren(nodesWithChildren);
      const { nodes, bottom, right } = getCanvasObjects(
        memberTree,
        membersTop,
        membersLeft,
        opts
      );
      membersTop = bottom + NODE_MARGIN_BOTTOM;

      if (bottom > maxBottom) {
        maxBottom = bottom;
      }

      if (right > maxRight) {
        maxRight = right;
      }

      acc.push(...nodes);
      return acc;
    }, [] as fabric.Object[]);

    canvasObject = renderGroup(
      group.name,
      {
        top,
        left,
        width: maxRight - left - GroupSizes.paddingRight,
        height: maxBottom - top - GroupSizes.paddingTop,
      },
      opts.colors,
      nodesWithChildren.includes(node.data.name)
    );

    membersObjects.push(...objects);
  } else {
    canvasObject = renderNode(
      canvas,
      { left, top, node: node.data as GraphNode },
      opts,
      nodesWithChildren.includes(node.data.name)
    );
  }

  node.addCanvasNode(canvasObject);

  return {
    object: canvasObject,
    membersObjects: membersObjects,
    top,
    left,
    width: canvasObject.getScaledWidth(),
    height: canvasObject.getScaledHeight(),
  };
}
