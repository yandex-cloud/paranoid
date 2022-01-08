import { fabric } from "fabric";
import { AnchorSizes } from "./constants";
import { Colors } from "../models";

export default function renderAnchor(
  top: number,
  left: number,
  colors: Colors
) {
  return new fabric.Circle({
    top,
    left,
    radius: AnchorSizes.radius,
    fill: colors.nodeFill,
    stroke: colors.stroke,
  });
}
