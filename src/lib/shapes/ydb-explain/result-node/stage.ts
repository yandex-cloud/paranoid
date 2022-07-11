import { EnhancedColors, fabric } from "../../../models";
import { NodeSize } from "./constants";

export function getStage(name: string, colors: EnhancedColors) {
  return new fabric.Text(name, {
    fontSize: NodeSize.textFontSize,
    lineHeight: NodeSize.textLineHeight,
    left: 0,
    top: 0,
    fontFamily: "YS Text",
    fill: colors.getCommonColor("text-secondary"),
    hoverCursor: "pointer",
  });
}
