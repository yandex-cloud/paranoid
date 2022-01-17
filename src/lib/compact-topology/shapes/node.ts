import { fabric } from "fabric";

import { NodeSizes, AnchorSizes, CLIPBOARD_WIDTH } from "./constants";
import { GroupControls } from "../../constants";
import renderAnchor from "./anchor";
import renderMetrics from "./metrics";
import renderClipboard from "./clipboard";
import {
  GraphNode,
  EnhancedColors,
  ParanoidOpts,
  TextOverflow,
} from "../../models";
import { wrapText } from "../../utils";

function getStatusColor(color: string, colors: EnhancedColors) {
  switch (color) {
    case "ALIVE":
      return colors.getCommonColor("base-positive-heavy");
    case "DEGRADED":
      return colors.getCommonColor("base-warning-heavy");
    case "DEAD":
      return colors.getCommonColor("base-danger-heavy");
    default:
      return colors.getCommonColor("base-neutral");
  }
}

export interface NodeConfig {
  left: number;
  top: number;
  node: GraphNode;
}

function calculateHeight(
  node: GraphNode,
  nodeTitle: string,
  title: fabric.Object,
  meta: fabric.Object,
  metrics?: fabric.Object
) {
  // Calculate the new height for the node if the title or meta has the '\n' character
  if (
    nodeTitle.split("\n").length > 1 ||
    (node.meta && node.meta.split("\n").length > 1) ||
    node.metrics
  ) {
    return (
      NodeSizes.paddingTop +
      title.getBoundingRect().height +
      NodeSizes.metaMarginTop +
      meta.getBoundingRect().height +
      (metrics
        ? NodeSizes.metricsMarginTop + metrics.getBoundingRect().height
        : 0) +
      NodeSizes.paddingBottom
    );
  }

  return NodeSizes.height;
}

export default function renderNode(
  canvas: fabric.Canvas,
  config: NodeConfig,
  opts: ParanoidOpts,
  hasChildren?: boolean
) {
  const { left, top, node } = config;
  const colors = opts.colors;
  const renderNodeTitle = opts.renderNodeTitle;
  const onTitleClick = opts.onTitleClick;
  const prepareCopyText = opts.prepareCopyText;
  const textOverflow = opts.textOverflow || TextOverflow.Ellipsis;

  const nodeTitle = renderNodeTitle ? renderNodeTitle(node) : node.name;

  const title = new fabric.Text(nodeTitle || "", {
    fontSize: NodeSizes.titleFontSize,
    lineHeight: NodeSizes.titleLineHeight,
    left: NodeSizes.paddingLeft,
    top: NodeSizes.paddingTop,
    fontFamily: "YS Text",
    fill: colors.titleColor,
    hoverCursor: typeof onTitleClick === "function" ? "pointer" : "default",
  });

  if (typeof onTitleClick === "function") {
    title.on("mouseover", () => {
      title.set("fill", colors.titleHoverColor);
      canvas.requestRenderAll();
    });

    title.on("mouseout", () => {
      title.set("fill", colors.titleColor);
      canvas.requestRenderAll();
    });

    title.on("mousedown", () => {
      onTitleClick(node);
    });
  }

  const meta = new fabric.Text(node.meta || "", {
    fontSize: NodeSizes.textFontSize,
    lineHeight: NodeSizes.textLineHeight,
    left: NodeSizes.paddingLeft,
    top:
      NodeSizes.paddingTop +
      title.getBoundingRect().height +
      NodeSizes.metaMarginTop,
    fontFamily: "YS Text",
    fill: colors.textColor,
  });

  const metrics = node.metrics?.length
    ? renderMetrics(
        NodeSizes.paddingTop +
          title.getBoundingRect().height +
          meta.getBoundingRect().height +
          NodeSizes.metaMarginTop +
          NodeSizes.metricsMarginTop,
        NodeSizes.paddingLeft,
        node.metrics,
        colors,
        textOverflow === TextOverflow.Ellipsis
          ? NodeSizes.width - NodeSizes.paddingLeft - NodeSizes.paddingRight
          : Infinity
      )
    : undefined;

  let statusGroup;
  if (node.status) {
    const statusRect = new fabric.Rect({
      width: 12,
      height: 12,
      fill: getStatusColor(node.status, colors),
      rx: 3,
      ry: 3,
    });

    const statusText = new fabric.Text(node.status, {
      fontSize: NodeSizes.textFontSize,
      lineHeight: NodeSizes.textLineHeight,
      left: 16,
      fontFamily: "YS Text",
      fill: colors.textColor,
    });

    statusGroup = new fabric.Group([statusRect, statusText], {
      top:
        meta.getBoundingRect().top +
        meta.getBoundingRect().height -
        meta.getHeightOfLine(0),
      left: NodeSizes.width - statusText.getLineWidth(0) - 16 - 12,
      padding: 12,
    });
  }

  let width = hasChildren ? NodeSizes.widthWithAnchor : NodeSizes.width;

  if (textOverflow === TextOverflow.Ellipsis) {
    wrapText(title, NodeSizes.titleMaxWidth);
    wrapText(meta, NodeSizes.metaMaxWidth);
  } else {
    // Calculate the new width for the node
    const titleWidth = title.getBoundingRect().width;
    const metaWidth = meta.getBoundingRect().width;
    const statusGroupWidth = statusGroup
      ? statusGroup.getBoundingRect().width
      : 0;
    const metricsWidth = metrics
      ? metrics.getBoundingRect().width +
        NodeSizes.paddingLeft +
        NodeSizes.paddingRight
      : 0;

    width = Math.max(
      width,
      NodeSizes.paddingLeft +
        Math.max(titleWidth, metaWidth) +
        Math.max(CLIPBOARD_WIDTH + NodeSizes.paddingRight, statusGroupWidth) +
        (hasChildren ? NodeSizes.anchorOffset : 0),
      metricsWidth
    );

    if (statusGroup) {
      statusGroup.left =
        width -
        statusGroupWidth +
        12 - // statusGroupWidth with left padding
        (hasChildren ? NodeSizes.anchorOffset : 0); // anchor offset
    }
  }

  const height = calculateHeight(node, nodeTitle, title, meta, metrics);

  const bodyRect = new fabric.Rect({
    width,
    height,
    fill: colors.nodeFill,
    stroke: colors.nodeShadow,
    rx: NodeSizes.borderRadius,
    ry: NodeSizes.borderRadius,
    shadow: new fabric.Shadow({
      color: colors.nodeShadow,
      offsetY: 5,
      blur: 6,
    }),
  });

  const clipboard = renderClipboard(
    canvas,
    node,
    NodeSizes.paddingTop,
    width - NodeSizes.paddingLeft - NodeSizes.paddingRight,
    opts
  );

  clipboard.set("visible", false);

  const nodeGroup = [
    bodyRect,
    title,
    clipboard,
    meta,
    statusGroup,
    metrics,
  ].filter(Boolean) as fabric.Object[];

  if (hasChildren) {
    nodeGroup.push(
      renderAnchor(
        height / 2 - AnchorSizes.radius,
        width - AnchorSizes.paddingRight - NodeSizes.borderRadius * 2,
        colors
      )
    );
  }

  const group = new fabric.Group(nodeGroup, {
    left: left,
    top: top,
    ...GroupControls,
  });

  if (typeof prepareCopyText === "function") {
    group.on("mouseover", () => {
      clipboard.set("visible", true);
      canvas.requestRenderAll();
    });
    group.on("mouseout", () => {
      clipboard.set("visible", false);
      canvas.requestRenderAll();
    });
  }

  return group;
}
