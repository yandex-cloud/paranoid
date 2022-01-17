import { TreeNode } from "../../tree";
import { ParanoidEmmiter } from "../../event-emmiter";
import { Coordinates, ParanoidOpts } from "../../models";
import { TopolgyNodeShape } from "./node";

export function getPostgresqlPlanNodeShape(
  canvas: fabric.Canvas,
  coords: Coordinates,
  node: TreeNode,
  opts: ParanoidOpts,
  em: ParanoidEmmiter
) {
  return new TopolgyNodeShape(canvas, coords, node, opts, em);
}
