import { fabric } from "fabric";
import { GroupControls } from "./constants";
import { Colors, LinkType } from "../models";

function getLineStart(parent: fabric.Group) {
  const { left = 0, top = 0, width = 0, height = 0 } = parent;
  return {
    x: left + width,
    y: top + height / 2,
  };
}

function getLineEnd(child: fabric.Group) {
  const { left = 0, top = 0, height = 0 } = child;
  return {
    x: left,
    y: top + height / 2,
  };
}

const CURVE_START_OFFSET_X = 4;
const CURVE_END_OFFSET_X = 12;

function getArrowPath(x: number, y: number) {
  const arrowHight = 8;
  const arrowBase = 6;
  const tops = {
    x1: x,
    y1: y,
    x2: x - arrowHight,
    y2: y - arrowBase / 2,
    x3: x - arrowHight,
    y3: y + arrowBase / 2,
  };

  return `M ${tops.x1} ${tops.y1}
    L ${tops.x3} ${tops.y3}
    L ${tops.x2} ${tops.y2}
    L ${tops.x1} ${tops.y1}
    `;
}

interface Coords {
  x: number;
  y: number;
}

function getCurvePath(start: Coords, end: Coords) {
  const diffY = end.y - start.y;
  if (Math.abs(diffY) < 5) {
    return `L ${end.x} ${end.y}`;
  }

  return `L ${end.x} ${end.y}`;
}

export default function renderLine(
  parent: fabric.Group,
  child: fabric.Group,
  colors: Colors,
  lineType: LinkType
) {
  const { x: x0, y: y0 } = getLineStart(parent);
  const { x, y } = getLineEnd(child);
  const curveStart = {
    y: y0,
    x: x0 + CURVE_START_OFFSET_X,
  };
  const curveEnd = {
    y,
    x: x - CURVE_END_OFFSET_X,
  };

  // const qx = 16 + curveStart.x + ((curveEnd.x - curveStart.x) / 2);
  // const qy = 16 + curveStart.y + ((curveEnd.y - curveStart.y) / 2);

  const line = new fabric.Path(
    `M ${x0} ${y0}
        H ${curveStart.x}
        ${getCurvePath(curveStart, curveEnd)}
        H ${x}
        `,
    {
      fill: "",
      stroke: colors.stroke,
      strokeWidth: 1,
    }
  );
  const group = [line];

  if (lineType !== LinkType.Line) {
    const arrow = new fabric.Path(getArrowPath(x, y), {
      fill: colors.stroke,
      stroke: colors.stroke,
      strokeWidth: 1,
    });
    group.push(arrow);
  }

  return new fabric.Group(group, { ...GroupControls });
}
