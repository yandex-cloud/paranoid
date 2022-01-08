import { fabric } from "fabric";

import Tree, { TreeNode } from "./tree";
import { Options, GraphNode, Colors } from "../models";
import { GraphGroupNode, Source } from "../parser";

import renderNode from "../shapes/node";
import renderGroup from "../shapes/group";
import { GroupSizes } from "../shapes/constants";

export const NODE_MARGIN_BOTTOM = 15;
export const NODE_MARGIN_RIGHT = 40;

function getHeightsSum(arr: fabric.Object[]) {
  return arr.reduce((acc, object) => acc + object.getScaledHeight() || 0, 0);
}

export class ParanoidNode extends TreeNode<Source> {
  getCanvasObject(
    canvas: fabric.Canvas,
    top: number,
    left: number,
    membersTrees: ParanoidTree[],
    opts: Options,
    nodesWithChildren: string[]
  ) {
    let canvasObject: fabric.Object;
    const membersObjects: fabric.Object[] = [];

    const group = this.data as GraphGroupNode;
    if (membersTrees.length > 0) {
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
      const objects = membersTrees.reduce((acc, memberTree) => {
        memberTree.setCanvas(canvas);
        memberTree.setNodesWithChildren(nodesWithChildren);
        const { nodes, bottom, right } = memberTree.getCanvasObjects(
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
        opts.colors as Colors,
        nodesWithChildren.includes(this.data.name)
      );

      membersObjects.push(...objects);
    } else {
      canvasObject = renderNode(
        canvas,
        { left, top, node: this.data as GraphNode },
        opts,
        nodesWithChildren.includes(this.data.name)
      );
    }

    this.addCanvasNode(canvasObject);

    return {
      object: canvasObject,
      membersObjects: membersObjects,
      top,
      left,
      width: canvasObject.getScaledWidth(),
      height: canvasObject.getScaledHeight(),
    };
  }
}

const left0 = 10;
const top0 = 10;

export default class ParanoidTree extends Tree<Source> {
  canvas?: fabric.Canvas;
  nodesWithChildren: string[] = [];

  getCanvasObjects(treeTop = top0, treeLeft = left0, opts: Options) {
    const top = treeTop;
    const left = treeLeft;
    const nodes: fabric.Object[] = [];
    const groupMembers: fabric.Object[] = [];

    let maxHeight = 0;
    let maxWidth = 0;
    this.traverseByLevels((treeNodes, level) => {
      const objectsAtCurrentLevel: fabric.Object[] = [];
      let levelHeight = 0;
      let levelWidth = 0;

      const canvasObjects = treeNodes.map((treeNode, i) => {
        const leftOffset = left + NODE_MARGIN_RIGHT * level + maxWidth;

        const topOffset =
          top + getHeightsSum(objectsAtCurrentLevel) + NODE_MARGIN_BOTTOM * i;

        const { object, membersObjects } = (
          treeNode as ParanoidNode
        ).getCanvasObject(
          this.canvas as fabric.Canvas,
          topOffset,
          leftOffset,
          treeNode.members as ParanoidTree[],
          opts,
          this.nodesWithChildren
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
    const summNodeMargins = this.getTreeDepth() * NODE_MARGIN_RIGHT;
    const treeBottom = maxHeight + top;
    const treeRight = maxWidth + left + summNodeMargins;

    return { nodes, bottom: treeBottom, right: treeRight };
  }

  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  setNodesWithChildren(nodesWitchChildren: string[]) {
    this.nodesWithChildren = nodesWitchChildren;
  }
}
