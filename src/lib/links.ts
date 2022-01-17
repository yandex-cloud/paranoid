import { fabric } from "fabric";
import { getNodeBottomCenter, getNodeTopCenter } from "./layout/topology/utils";
import {
  BOTTOM_OFFSET,
  BOTTOM_OFFSET_WITH_MULTIPLE_CHILDREN,
} from "./layout/topology/get-node-coordinates";
import Parser from "./parser";
import { GroupControls } from "./constants";
import { ParanoidOpts } from "./models";

export function getTopologyLinks(parser: Parser, opts: ParanoidOpts) {
  const colors = opts.colors;
  const hasLinks: string[] = [];
  return parser.data.links.reduce((acc, { from }) => {
    const parent = parser.nodes.get(from);

    if (parent && parent.children.length === 1 && !hasLinks.includes(from)) {
      const { x, y } = getNodeBottomCenter(parent);
      const line = new fabric.Path(
        `M ${x} ${y}
                V ${y + BOTTOM_OFFSET}`,
        {
          fill: "",
          stroke: colors.stroke,
          strokeWidth: 1,
        }
      );

      acc.push(new fabric.Group([line], { ...GroupControls }));

      hasLinks.push(from);
    }

    if (parent && parent.children.length > 1 && !hasLinks.includes(from)) {
      const { x, y } = getNodeBottomCenter(parent);
      const lineOffset = BOTTOM_OFFSET_WITH_MULTIPLE_CHILDREN / 2;
      const curveOffset = 6;
      const line = new fabric.Path(
        `M ${x} ${y}
                V ${y + lineOffset}`,
        {
          fill: "",
          stroke: colors.stroke,
          strokeWidth: 1,
        }
      );
      const group = [line];
      const { x: x0, y: y0 } = getNodeTopCenter(parent.children[0]);
      const { x: x1, y: y1 } = getNodeTopCenter(
        parent.children[parent.children.length - 1]
      );

      const line2 = new fabric.Path(
        `M ${x0} ${y0}
                V ${y0 - lineOffset + curveOffset}
                Q ${x0} ${y0 - lineOffset} ${x0 + curveOffset} ${
          y0 - lineOffset
        }
                H ${x1 - curveOffset}
                Q ${x1} ${y1 - lineOffset} ${x1} ${
          y1 + curveOffset - lineOffset
        }
                V ${y1}
                `,
        {
          fill: "",
          stroke: colors.stroke,
          strokeWidth: 1,
        }
      );

      group.push(line2);

      parent.children.forEach((child, i) => {
        if (i === 0 || i === parent.children.length - 1) {
          // first and last child link already rendered
          return;
        }

        const { x, y } = getNodeTopCenter(child);

        const childLine = new fabric.Path(
          `M ${x} ${y}
                    V ${y - lineOffset}
                    `,
          {
            fill: "",
            stroke: colors.stroke,
            strokeWidth: 1,
          }
        );

        group.push(childLine);
      });

      acc.push(new fabric.Group(group, { ...GroupControls }));

      hasLinks.push(from);
    }

    return acc;
  }, [] as fabric.Group[]);
}
