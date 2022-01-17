import { fabric } from "fabric";
import { NodeSizes } from "./constants";
import { Metric, EnhancedColors } from "../../models";

function getFillColor(metric: Metric, colors: EnhancedColors) {
  switch (metric.theme) {
    case "warning":
      return colors.warning;
    case "danger":
      return colors.error;
  }
  return colors.textColor;
}

export default function renderMetrics(
  top: number,
  left: number,
  metrics: Metric[],
  colors: EnhancedColors,
  maxWidth = Infinity
) {
  const metricsNodes: fabric.Group[] = [];
  let curTop = 0;
  let curLeft = 0;
  for (let i = 0; i < metrics.length; i++) {
    const curMetric = metrics[i];
    const nameNode = new fabric.Text(curMetric.name + ": ", {
      fontSize: NodeSizes.textFontSize,
      lineHeight: NodeSizes.textLineHeight,
      fontFamily: "YS Text",
      fill: colors.textColor,
    });
    const valueNode = new fabric.Text(curMetric.value, {
      fontSize: NodeSizes.textFontSize,
      lineHeight: NodeSizes.textLineHeight,
      fontFamily: "YS Text",
      fill: getFillColor(curMetric, colors),
      left: nameNode.width ?? 0,
    });
    const metricWidth = (nameNode.width ?? 0) + (valueNode.width ?? 0);
    if (curLeft + metricWidth > maxWidth) {
      curLeft = 0;
      curTop +=
        (metricsNodes?.[metricsNodes.length - 1]?.height ?? 0) +
        NodeSizes.metricsPadding;
    }
    const groupNode = new fabric.Group([nameNode, valueNode], {
      top: curTop,
      left: curLeft,
    });
    curLeft += (groupNode.width ?? 0) + NodeSizes.metricsPadding;
    metricsNodes.push(groupNode);
  }

  return new fabric.Group(metricsNodes, {
    top,
    left,
  });
}
