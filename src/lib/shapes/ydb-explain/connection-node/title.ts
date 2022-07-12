import { EnhancedColors, fabric } from "../../../models";
import { GroupControls } from "../../../constants";
import {
  createMergeIcon,
  createUnionIcon,
  createShuffleIcon,
  createMapIcon,
  createBroadcastIcon,
} from "../../../icons";
import { NodeSize } from "./constants";

export function getTitle(
  name: string,
  isExpandable: boolean,
  colors: EnhancedColors
) {
  const text = new fabric.Text(name, {
    fontSize: NodeSize.textFontSize,
    lineHeight: NodeSize.textFontSize,
    fontFamily: "YS Text",
    fill: colors.getCommonColor("text-misc"),
    originY: "center",
    hoverCursor: isExpandable ? "pointer" : "default",
  });
  const items: fabric.Object[] = [text];
  let icon;

  switch (name) {
    case "Merge":
      icon = createMergeIcon();
      break;
    case "UnionAll":
      icon = createUnionIcon();
      break;
    case "HashShuffle":
      icon = createShuffleIcon();
      break;
    case "Map":
      icon = createMapIcon();
      break;
    case "Broadcast":
      icon = createBroadcastIcon();
      break;
  }

  if (icon) {
    icon.set({
      fill: colors.getCommonColor("text-misc"),
      top: 0,
      left: -22,
    });
    items.push(icon);
  }

  return new fabric.Group(items, { ...GroupControls });
}
