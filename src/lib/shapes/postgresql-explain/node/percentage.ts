import { Colors, fabric } from "../../../models";
import { NodeSize } from "./constants";
import _ from "lodash";
export function getPercentage(timePercentage: string, colors: Colors) {
  const value = _.isNaN(Number(timePercentage)) ? "0" : timePercentage;
  return new fabric.Text(`${value}%`, {
    fontSize: NodeSize.textFontSize,
    lineHeight: NodeSize.textLineHeight,
    left: 0,
    top: 0,
    fontFamily: "YS Text",
    fill: colors?.titleColor,
  });
}
