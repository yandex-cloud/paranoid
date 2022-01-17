import { fabric } from "fabric";

import { GroupSizes, NodeSizes, AnchorSizes } from "./constants";
import renderAnchor from "./anchor";
import { Colors } from "../../models";
import { GroupControls } from "../../constants";

export interface GroupDimensions {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function renderGroup(
  name: string,
  dimentions: GroupDimensions,
  colors: Colors,
  hasChildren?: Boolean
) {
  const { left, top, width, height } = dimentions;
  const title = new fabric.Text(name || "", {
    fontSize: NodeSizes.titleFontSize,
    lineHeight: 18,
    left: GroupSizes.paddingLeft,
    top: GroupSizes.paddingTop,
    fontFamily: "YS Text",
    fill: colors.titleColor,
  });

  const groupHeight = height + GroupSizes.paddingBottom + (title.height || 0); // title with paddings

  let groupWidth = width + GroupSizes.paddingLeft + GroupSizes.paddingRight;

  if (hasChildren) {
    groupWidth += AnchorSizes.paddingRight;
  }

  const rect = new fabric.Rect({
    width: groupWidth,
    height: groupHeight,
    stroke: colors.groupBorderColor,
    fill: colors.groupFill,
    rx: NodeSizes.borderRadius,
    ry: NodeSizes.borderRadius,
  });

  const objectsGroup: fabric.Object[] = [rect, title];

  if (hasChildren) {
    objectsGroup.push(
      renderAnchor(
        groupHeight / 2 - AnchorSizes.radius,
        groupWidth - NodeSizes.paddingLeft - NodeSizes.borderRadius * 2,
        colors
      )
    );
  }

  return new fabric.Group(objectsGroup, {
    left,
    top,
    ...GroupControls,
  });
}
