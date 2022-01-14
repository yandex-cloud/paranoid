import { Colors, fabric } from "../../../models";
import { GroupControls } from "../../../constants";
import { NodeSize } from "./constants";

export interface NodeMeta {
  key?: string;
  items: Array<string | number>;
}

export function getMeta(meta: NodeMeta | undefined, colors: Colors) {
  const top = 0;

  if (!meta) {
    return new fabric.Group([], {
      top,
      ...GroupControls,
    });
  }

  const { key, items } = meta;

  const groupItems: fabric.Object[] = [];
  let keyText;
  if (key) {
    keyText = new fabric.Textbox(key, {
      fontSize: NodeSize.textFontSize,
      lineHeight: NodeSize.textLineHeight,
      top,
      left: NodeSize.padding,
      fontFamily: "YS Text",
      fill: colors?.textColor,
    });
    groupItems.push(keyText);
  }
  const keyWidth = keyText ? keyText.getScaledWidth() + 2 : 0;

  const left = NodeSize.padding + keyWidth;
  const width = NodeSize.width - NodeSize.padding - keyWidth - NodeSize.padding;
  let nextTop = top;

  items.reduce((acc, item) => {
    const box = new fabric.Textbox(String(item), {
      fontSize: NodeSize.textFontSize,
      lineHeight: NodeSize.textLineHeight,
      left,
      top: nextTop,
      width,
      fontFamily: "YS Text",
      fill: colors?.titleColor,
      splitByGrapheme: true,
    });
    acc.push(box);
    nextTop += box.getScaledHeight();

    return acc;
  }, groupItems);

  return new fabric.Group(groupItems, {
    top,
    ...GroupControls,
  });
}
