import { EnhancedColors, fabric } from "../../../models";
import { GroupControls } from "../../../constants";
import { NodeSize } from "./constants";

export function getTables(tables: string[], colors: EnhancedColors) {
  if (tables.length === 0) {
    return new fabric.Group([], {
      top: 0,
      left: 0,
      ...GroupControls,
    });
  }

  const key = new fabric.Text("Tables:", {
    fontSize: NodeSize.textFontSize,
    lineHeight: NodeSize.textLineHeight,
    fontFamily: "YS Text",
    fill: colors.getCommonColor("text-secondary"),
    hoverCursor: "pointer",
  });
  const keyWidth = key.getScaledWidth();
  const valueLeft = keyWidth + 2;
  const valueWidth = NodeSize.width - NodeSize.padding * 2 - valueLeft;

  const value = new fabric.Textbox(tables.join("\n"), {
    left: valueLeft,
    width: valueWidth,
    fontSize: NodeSize.textFontSize,
    lineHeight: NodeSize.textLineHeight,
    fontFamily: "YS Text",
    fill: colors.getCommonColor("text-primary"),
    splitByGrapheme: true,
    hoverCursor: "pointer",
  });

  return new fabric.Group([key, value], {
    top: 0,
    left: 0,
    ...GroupControls,
  });
}
