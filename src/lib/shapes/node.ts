import { fabric } from "fabric";

import {
  GroupControls,
  NodeSizes,
  AnchorSizes,
  CLIPBOARD_WIDTH,
} from "./constants";
import renderAnchor from "./anchor";
import renderClipboard from "./clipboard";
import { GraphNode, Colors, Options, TextOverflow } from "../models";

function getStatusColor(color: string, colors: Colors) {
  switch (color) {
    case "ALIVE":
      return colors.success;
    case "DEGRADED":
      return colors.warning;
    case "DEAD":
      return colors.error;
    default:
      return colors.mute;
  }
}

function wrapText(container: fabric.Text, maxWidth: number) {
  let width = Math.ceil(container.getLineWidth(0));

  while (width > maxWidth) {
    const text = container.text || "";
    container.set("text", text.slice(0, text.length - 4) + "...");
    width = Math.ceil(container.getLineWidth(0));
  }
}

export interface NodeConfig {
  left: number;
  top: number;
  node: GraphNode;
}

export default function renderNode(
  canvas: fabric.Canvas,
  config: NodeConfig,
  opts: Options,
  hasChildren?: boolean
) {
  const { left, top, node } = config;
  const colors = opts.colors as Colors;
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
  let height = NodeSizes.height;

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

    width = Math.max(
      width,
      NodeSizes.paddingLeft +
        Math.max(titleWidth, metaWidth) +
        Math.max(CLIPBOARD_WIDTH + NodeSizes.paddingRight, statusGroupWidth) +
        (hasChildren ? NodeSizes.anchorOffset : 0)
    );

    if (statusGroup) {
      statusGroup.left =
        width -
        statusGroupWidth +
        12 - // statusGroupWidth with left padding
        (hasChildren ? NodeSizes.anchorOffset : 0); // anchor offset
    }
  }

  // Calculate the new height for the node if the title or meta has the '\n' character
  if (
    nodeTitle.split("\n").length > 1 ||
    (node.meta && node.meta.split("\n").length > 1)
  ) {
    height =
      NodeSizes.paddingTop +
      title.getBoundingRect().height +
      NodeSizes.metaMarginTop +
      meta.getBoundingRect().height +
      NodeSizes.paddingBottom;
  }

  const bodyRect = new fabric.Rect({
    width,
    height,
    fill: colors.nodeFill,
    rx: NodeSizes.borderRadius,
    ry: NodeSizes.borderRadius,
    shadow: new fabric.Shadow({
      color: colors.nodeShadow,
      offsetY: 1,
      blur: 5,
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

  const nodeGroup = [bodyRect, title, clipboard, meta, statusGroup].filter(
    Boolean
  ) as fabric.Object[];

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
