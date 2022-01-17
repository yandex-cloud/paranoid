import { fabric } from "fabric";
import copyToClipboard from "copy-to-clipboard";

import { ParanoidOpts, GraphNode } from "../../models";
import { CLIPBOARD_WIDTH } from "./constants";

const mainPath = `
    M19,21
    H8
    V7
    H19
    M19,5
    H8
    A2,2 0 0,0 6,7
    V21
    A2,2 0 0,0 8,23
    H19
    A2,2 0 0,0 21,21
    V7
    A2,2 0 0,0 19,5
    M16,1
    H4
    A2,2 0 0,0 2,3
    V17
    H4
    V3
    H16
    V1
    Z
`;

const successPath = "M9.5 13l3 3l5 -5";
const errorPath = "M9.5 10l8 8m-8 0l8 -8";

export default function renderClipboard(
  canvas: fabric.Canvas,
  node: GraphNode,
  top: number,
  left: number,
  opts: ParanoidOpts
) {
  const colors = opts.colors;
  const prepareCopyText = opts.prepareCopyText;
  const path = new fabric.Path(mainPath, {
    fill: colors.stroke,
    hoverCursor: "pointer",
  });

  const success = new fabric.Path(successPath, {
    stroke: colors.stroke,
    fill: "",
    hoverCursor: "pointer",
    opacity: 0,
  });

  const error = new fabric.Path(errorPath, {
    stroke: colors.stroke,
    fill: "",
    hoverCursor: "pointer",
    opacity: 0,
  });

  const group = new fabric.Group([path, success, error], {
    top,
    left: left - CLIPBOARD_WIDTH,
    scaleX: 0.6,
    scaleY: 0.6,
  });

  if (typeof prepareCopyText === "function") {
    group.on("mousedown", () => {
      const text = prepareCopyText(node);
      const result = copyToClipboard(text);

      const status = result ? success : error;
      status.animate("opacity", 1, {
        duration: 150,
        onChange: canvas.requestRenderAll.bind(canvas),
        easing: fabric.util.ease.easeInOutSine,
        onComplete: () => {
          setTimeout(() => {
            status.set("opacity", 0);
            canvas.requestRenderAll();
          }, 1000);
        },
      });
    });
  }

  return group;
}
