import { Colors, fabric, TopologyNodeTag } from "../../../models";
import { GroupControls } from "../../../constants";
import { NodeSize } from "./constants";

function getTag(
  { value, theme }: TopologyNodeTag,
  top: number,
  left: number,
  colors: Colors
) {
  const title = new fabric.Text(value, {
    left: NodeSize.textOffset,
    top: NodeSize.textOffset / 2,
    fontSize: NodeSize.textFontSize,
    lineHeight: NodeSize.textLineHeight,
    fontFamily: "YS Text",
    fill: theme === "danger" ? colors?.error : colors?.warning,
  });

  const rect = new fabric.Rect({
    width: title.getScaledWidth() + NodeSize.textOffset * 2,
    height: 20,
    fill:
      theme === "danger" ? colors?.errorBackground : colors?.warningBackground,
    rx: NodeSize.borderRadius,
    ry: NodeSize.borderRadius,
  });

  return new fabric.Group([rect, title], {
    left: left,
    top: top,
    ...GroupControls,
  });
}

export function getTags(tags: TopologyNodeTag[], colors: Colors) {
  let tagTop = 0;
  const width = NodeSize.width - NodeSize.padding * 2;

  const tagObjects = tags.reduce((acc, tag, index) => {
    let left = 0;
    const previousTag = acc[index - 1];

    if (previousTag) {
      left +=
        (previousTag.left || 0) +
        previousTag.getScaledWidth() +
        NodeSize.textOffset;
    }

    const tagObject = getTag(tag, tagTop, left, colors);

    if (left + tagObject.getScaledWidth() >= width) {
      left = 0;
      tagTop += tagObject.getScaledHeight() + NodeSize.textOffset;
      tagObject.set({ left, top: tagTop });
    }

    acc.push(tagObject);

    return acc;
  }, [] as fabric.Object[]);

  return new fabric.Group(tagObjects, {
    ...GroupControls,
  });
}
