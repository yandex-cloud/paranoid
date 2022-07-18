import _ from "lodash";
import { TreeNode } from "../../tree";
import { ParanoidEmmiter } from "../../event-emmiter";
import { Coordinates, ParanoidOpts } from "../../models";
import { StageNodeShape } from "./stage-node";
import { ConnectionNodeShape } from "./connection-node";
import { ResultNodeShape } from "./result-node";
import { QueryNodeShape } from "./query-node";

function isConnectionNode(node: TreeNode) {
  const data = _.get(node, ["data", "data"]);

  return data?.type === "connection";
}

function isResultNode(node: TreeNode) {
  const data = _.get(node, ["data", "data"]);

  return data?.type === "result";
}

function isQueryNode(node: TreeNode) {
  const data = _.get(node, ["data", "data"]);

  return data?.type === "query";
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
  } else if (isResultNode(node)) {
    return new ResultNodeShape(canvas, coords, node, opts, em);
  } else if (isQueryNode(node)) {
    return new QueryNodeShape(canvas, coords, node, opts, em);
  } else {
    return new StageNodeShape(canvas, coords, node, opts, em);
  }
}
