import { Colors, fabric } from "../../../models";
import { NodeSize } from "./constants";

export function getTitle(name: string, colors: Colors) {
  return new fabric.Text(name, {
    fontSize: NodeSize.titleFontSize,
    lineHeight: NodeSize.titleLineHeight,
    left: 0,
    top: 0,
    fontFamily: "YS Text",
    fill: colors?.titleColor,
  });
}
