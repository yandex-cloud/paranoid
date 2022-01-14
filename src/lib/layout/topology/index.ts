import { ParanoidEmmiter } from "src/lib/event-emmiter";
import { ParanoidOpts, Shapes } from "../../models";
import { Tree, TreeNode } from "../../tree";
import { doTraverse } from "./traverse";

export function getCanvasObjects(
  tree: Tree,
  top: number,
  left: number,
  opts: ParanoidOpts,
  shapes: Shapes,
  em: ParanoidEmmiter
) {
  const nodes: fabric.Object[] = doTraverse(
    tree.canvas as fabric.Canvas,
    opts,
    shapes,
    tree.root,
    top,
    left,
    em
  );

  let maxRight = 0;
  let maxBottom = 0;

  nodes.forEach((node) => {
    maxRight = Math.max(maxRight, (node.left || 0) + node.getScaledWidth());

    maxBottom = Math.max(maxBottom, (node.top || 0) + node.getScaledHeight());
  });

  return { nodes, bottom: maxBottom, right: maxRight };
}

export function getCanvasObject(
  canvas: fabric.Canvas,
  node: TreeNode,
  top: number,
  left: number,
  opts: ParanoidOpts,
  shapes: Shapes,
  em: ParanoidEmmiter
) {
  const shape = shapes.node(canvas, { top, left }, node, opts, em);
  const object = shape.getShape();
  node.addShapeInstance(shape);
  node.addCanvasNode(object);

  return {
    object,
    top,
    left,
    width: object.getScaledWidth(),
    height: object.getScaledHeight(),
  };
}
