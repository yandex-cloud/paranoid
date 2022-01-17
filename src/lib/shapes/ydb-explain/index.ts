import _ from "lodash";
import { TreeNode } from "../../tree";
import { ParanoidEmmiter } from "../../event-emmiter";
import { Coordinates, ParanoidOpts } from "../../models";
import { StageNodeShape } from "./stage-node";
import { ConnectionNodeShape } from "./connection-node";

function isConnectionNode(node: TreeNode) {
  const data = _.get(node, ["data", "data"]);

  return data?.type === "connection";
}

export function getYdbPlanNodeShape(
  canvas: fabric.Canvas,
  coords: Coordinates,
  node: TreeNode,
  opts: ParanoidOpts,
  em: ParanoidEmmiter
) {
  if (isConnectionNode(node)) {
    return new ConnectionNodeShape(canvas, coords, node, opts, em);
  } else {
    return new StageNodeShape(canvas, coords, node, opts, em);
  }
}
