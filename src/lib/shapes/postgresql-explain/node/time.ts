import { Colors, fabric } from "../../../models";
import { NodeSize } from "./constants";
import _ from "lodash";

export function getTime(time: number, colors: Colors) {
  let value = time.toFixed(1);
  if (_.isNaN(time)) {
    value = "0";
  } else if (time < 1) {
    value = "<1";
  }
  return new fabric.Text(`${value}ms`, {
    fontSize: NodeSize.textFontSize,
    lineHeight: NodeSize.textLineHeight,
    left: 0,
    top: 0,
    fontFamily: "YS Text",
    fill: colors?.textColor,
  });
}
