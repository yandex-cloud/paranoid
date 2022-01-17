import {
  Colors,
  Coordinates,
  fabric,
  TopologyNodeDataStats,
  TopologyNodeDataStatsSection,
  TopologyNodeDataStatsItem,
} from "../../../models";
import { GroupControls } from "../../../constants";
import { NodeSize } from "./constants";

interface StatsContent {
  group: string;
  items: fabric.Group;
  title: fabric.Text;
  hoverLine: fabric.Path;
}

class StatsController {
  private canvas: fabric.Canvas;
  private stats: TopologyNodeDataStats[];
  private coords: Coordinates;
  private colors: Colors;
  private textProps: fabric.TextOptions;
  private selectedGroup: string;
  private group: fabric.Group;
  private content: StatsContent[];

  private top = 0;
  private left = 0;
  private lineTop: number;

  constructor(
    canvas: fabric.Canvas,
    stats: TopologyNodeDataStats[],
    coords: Coordinates,
    colors: Colors
  ) {
    this.canvas = canvas;
    this.stats = stats;
    this.coords = coords;
    this.colors = colors;
    this.textProps = {
      fontSize: NodeSize.textFontSize,
      lineHeight: NodeSize.textLineHeight,
      fontFamily: "YS Text",
      fill: colors?.titleColor,
    };
    this.selectedGroup = stats[0].group;

    const titles = this.createTitles();

    const titleHeights = titles.map((title) => title.getScaledHeight());
    const titleMaxHeight = Math.max.apply(null, titleHeights);
    this.lineTop = this.top + titleMaxHeight + NodeSize.textOffset;

    const line = this.createLine();
    this.content = this.createContent(titles);
    this.group = this.createGroup(titles, line, this.content);
    this.initListeners();
  }

  getCanvasObject() {
    return this.group;
  }

  private createTitles() {
    let titleLeft = this.left;

    return this.stats
      .map(({ group }) => group)
      .map((title) => {
        const object = new fabric.Text(title, {
          left: titleLeft,
          top: this.top,
          ...this.textProps,
          fill:
            title === this.selectedGroup
              ? this.colors?.titleColor
              : this.colors?.textColor,
        });

        titleLeft += object.getScaledWidth() + NodeSize.statsOffset;

        return object;
      });
  }

  private createLine() {
    return new fabric.Path(
      `M ${this.left} ${this.lineTop}
            H ${NodeSize.expandedWidth - NodeSize.padding * 2}`,
      {
        fill: "",
        stroke: this.colors.stroke,
        strokeWidth: 1,
      }
    );
  }

  private createContent(titles: fabric.Text[]) {
    return this.stats.map(({ group, stats }, index) => {
      const canvasGroup = this.getContentItems(stats, this.lineTop);
      const title = titles[index];
      const lineStart = title.left || 0;
      const lineEnd = lineStart + title.getScaledWidth();

      return {
        group,
        items: new fabric.Group(canvasGroup, {
          opacity: this.selectedGroup === group ? 1 : 0,
        }),
        title,
        hoverLine: this.createHoverLine(lineStart, lineEnd, group),
      };
    });
  }

  private getContentItems(
    stats: TopologyNodeDataStatsSection[] | TopologyNodeDataStatsItem[],
    top: number
  ) {
    let nextTop = top + NodeSize.textOffset * 2;
    const objects: fabric.Object[] = [];

    const addItems = (items: TopologyNodeDataStatsItem[]) => {
      items.forEach(({ name, value }) => {
        const stat = new fabric.Text(name, {
          left: this.left,
          top: nextTop,
          ...this.textProps,
        });

        const valLeft = NodeSize.expandedWidth / 2 - NodeSize.padding;
        const valRight = NodeSize.expandedWidth - NodeSize.padding * 2;

        const val = new fabric.Textbox(String(value), {
          left: valLeft,
          top: nextTop,
          ...this.textProps,
          fill: this.colors?.textColor,
          splitByGrapheme: true,
          width: valRight - valLeft,
        });

        objects.push(stat, val);
        nextTop +=
          Math.max(stat.getScaledHeight(), val.getScaledHeight()) +
          NodeSize.textOffset;
      });
    };

    if (isStatsSections(stats)) {
      stats.forEach(({ name, items }, index) => {
        const statSection = new fabric.Text(name, {
          left: this.left,
          top: nextTop,
          ...this.textProps,
          fontWeight: "bold",
        });

        objects.push(statSection);
        nextTop += statSection.getScaledHeight() + NodeSize.textOffset;
        addItems(items);

        if (index !== stats.length - 1) {
          const separator = new fabric.Path(
            `M ${this.left} ${nextTop}
                        H ${NodeSize.expandedWidth - NodeSize.padding * 2}`,
            {
              fill: "",
              stroke: this.colors.stroke,
              strokeWidth: 1,
              strokeDashArray: [6, 4],
            }
          );

          objects.push(separator);
          nextTop += separator.getScaledHeight() + NodeSize.textOffset;
        }
      });
    } else {
      addItems(stats);
    }

    return objects;
  }

  private createGroup(
    titles: fabric.Text[],
    line: fabric.Path,
    content: StatsContent[]
  ) {
    const contentItems = content.map(({ items }) => items);
    const hoverLines = content.map(({ hoverLine }) => hoverLine);
    return new fabric.Group([...titles, line, ...contentItems, ...hoverLines], {
      left: this.coords.left,
      top: this.coords.top,
      ...GroupControls,
    });
  }

  private createHoverLine(start: number, end: number, group: string) {
    return new fabric.Path(
      `M ${start} ${this.lineTop - 1}
            H ${end}`,
      {
        fill: "",
        stroke: this.colors.specialHover,
        strokeWidth: 2,
        opacity: this.selectedGroup === group ? 1 : 0,
      }
    );
  }

  private initListeners() {
    this.content.forEach(({ group, title, items, hoverLine }) => {
      title.on("mousedown", () => {
        const currentGroup = this.selectedGroup;
        const currentContent = this.content.find(
          (item) => item.group === currentGroup
        );

        if (currentContent) {
          currentContent.title.set({ fill: this.colors.textColor });
          currentContent.items.set({ opacity: 0 });
          currentContent.hoverLine.set({ opacity: 0 });

          title.set({ fill: this.colors.titleColor });
          items.set({ opacity: 1 });
          hoverLine.set({ opacity: 1 });

          this.selectedGroup = group;
          this.canvas.requestRenderAll();
        }
      });
    });
  }
}

function isStatsSections(
  stats: TopologyNodeDataStatsSection[] | TopologyNodeDataStatsItem[]
): stats is TopologyNodeDataStatsSection[] {
  return Boolean((stats as TopologyNodeDataStatsSection[])[0]?.items);
}

export function getStats(
  canvas: fabric.Canvas,
  stats: TopologyNodeDataStats[],
  statsTop: number,
  statsLeft: number,
  colors: Colors
) {
  const sC = new StatsController(
    canvas,
    stats,
    { top: statsTop, left: statsLeft },
    colors
  );

  return sC.getCanvasObject();
}
