import _ from "lodash";
import {
  ParanoidOpts,
  Coordinates,
  fabric,
  TopologyNodeData,
  Shape,
} from "../../../models";
import { GroupControls } from "../../../constants";
import { NodeSize } from "./constants";
import { getTags } from "./tags";
import { getTitle } from "./title";
import { getTime } from "./time";
import { getPercentage } from "./percentage";
import { getMeta } from "./meta";
import { getStats } from "./stats";
import { TreeNode } from "../../../tree";
import { ParanoidEmmiter } from "../../../event-emmiter";
import {
  getTreeMaxRight,
  recalculatePositions,
} from "../../../layout/topology/utils";

export class TopolgyNodeShape implements Shape {
  private canvas: fabric.Canvas;
  private coords: Coordinates;
  private treeNode: TreeNode;
  private data: TopologyNodeData;
  private opts: ParanoidOpts;
  private em: ParanoidEmmiter;
  private objects: fabric.Object[];
  private body: fabric.Object;
  private group: fabric.Group;
  private expanded = false;
  private shadow: fabric.Shadow;
  private hoverShadow: fabric.Shadow;
  private nodeHeight = 0;
  private expandedNodeHeight = 0;
  private stats?: fabric.Group;

  constructor(
    canvas: fabric.Canvas,
    coords: Coordinates,
    treeNode: TreeNode,
    opts: ParanoidOpts,
    em: ParanoidEmmiter
  ) {
    this.canvas = canvas;
    this.coords = coords;
    this.treeNode = treeNode;
    this.opts = opts;
    this.em = em;
    this.data = _.get(treeNode, ["data", "data"]);

    this.shadow = new fabric.Shadow({
      color: opts.colors.nodeShadow,
      offsetY: 5,
      blur: 6,
    });
    this.hoverShadow = new fabric.Shadow({
      color: opts.colors.nodeShadow,
      offsetY: 8,
      blur: 8,
    });

    this.objects = this.prepareShapeObjects();
    this.setShapeObjectsCoords();
    this.body = this.prepareNodeBody();
    this.group = this.createGroup();
    this.initListeners();
  }

  getShape() {
    return this.group;
  }

  getFillColor() {
    return this.opts.colors.nodeFill;
  }

  getHoverFillColor() {
    return this.opts.colors.nodeHover;
  }

  getShadow() {
    return this.shadow;
  }

  getHoverShadow() {
    return this.hoverShadow;
  }

  toggleHighlight(highlight: boolean) {
    if (!this.expanded) {
      this.body.set({
        fill: highlight ? this.getHoverFillColor() : this.getFillColor(),
        shadow: this.getHoverShadow(),
      });
    }
    this.canvas.requestRenderAll();
  }

  onExpand() {
    const colors = this.opts.colors;

    // @ts-ignore
    const [__, time, percentage] = this.objects; /* eslint-disable-line */
    const expandOffset = NodeSize.expandedWidth - NodeSize.width;

    if (this.expanded) {
      const width = NodeSize.width;
      const height = this.nodeHeight;

      this.body.set({
        width,
        height,
        fill: this.getFillColor(),
        shadow: this.getShadow(),
      });
      percentage.set({
        left: (percentage.left || 0) - expandOffset,
      });
      time.set({
        left: (time.left || 0) - expandOffset,
      });

      percentage.setCoords();
      time.setCoords();
      this.body.setCoords();
      this.group.removeWithUpdate(this.stats as fabric.Group);
      this.stats = undefined;
      return { width, height };
    } else {
      this.stats = getStats(
        this.canvas,
        this.data.stats,
        (this.group.top || 0) + this.body.getScaledHeight() + NodeSize.padding,
        (this.group.left || 0) + NodeSize.padding,
        colors
      );
      this.expandedNodeHeight =
        this.nodeHeight + this.stats.getScaledHeight() + NodeSize.padding * 2;

      const width = NodeSize.expandedWidth;
      const height = this.expandedNodeHeight;
      this.body.set({
        width,
        height,
        fill: this.getFillColor(),
        shadow: this.getShadow(),
      });

      percentage.set({
        left: (percentage.left || 0) + expandOffset,
      });
      time.set({
        left: (time.left || 0) + expandOffset,
      });

      percentage.setCoords();
      time.setCoords();
      this.body.setCoords();
      this.group.addWithUpdate(this.stats);

      return { width, height };
    }
  }

  private prepareNodeBody() {
    const colors = this.opts.colors;
    const tags = this.objects[this.objects.length - 1];

    this.nodeHeight =
      (tags.top || 0) + tags.getScaledHeight() + NodeSize.padding;

    return new fabric.Rect({
      width: NodeSize.width,
      height: this.nodeHeight,
      fill: colors?.nodeFill,
      stroke: colors?.nodeShadow,
      rx: NodeSize.borderRadius,
      ry: NodeSize.borderRadius,
      shadow: this.getShadow(),
      hoverCursor: "pointer",
    });
  }

  private prepareShapeObjects() {
    const opts = this.opts;
    const data = this.data;
    const colors = opts.colors;

    const title = getTitle(data.name, colors);
    const time = getTime(data.time, colors);
    const percentage = getPercentage(String(data.percent), colors);
    const metaGroup = getMeta(data.meta, colors);

    const tags = getTags(data.tags, colors);

    return [title, time, percentage, metaGroup, tags];
  }

  private setShapeObjectsCoords() {
    const [title, time, percentage, meta, tags] = this.objects;
    const top = NodeSize.padding;
    const left = NodeSize.padding;

    title.set({ left, top });
    const percentageOffset = NodeSize.width - NodeSize.padding;
    percentage.set({
      top,
      left: percentageOffset - percentage.getScaledWidth(),
    });
    time.set({
      top,
      left:
        (percentage.left || percentageOffset) -
        time.getScaledWidth() -
        NodeSize.textOffset,
    });

    const metaTop = top + title.getScaledHeight() + NodeSize.textOffset;
    let tagsTop = metaTop;
    meta.set({
      left,
      top: metaTop,
    });

    tagsTop += meta.getScaledHeight() + NodeSize.padding;

    tags.set({
      left,
      top: tagsTop,
    });
  }

  private createGroup() {
    const { top, left } = this.coords;
    return new fabric.Group([this.body, ...this.objects], {
      top,
      left,
      ...GroupControls,
    });
  }

  private initListeners() {
    this.initHover();
    this.initExpand();
  }

  private initHover() {
    this.group.on("mouseover", () => {
      this.em.dispatch("node:mouseover", this.treeNode);
      this.toggleHighlight(true);
    });

    this.group.on("mouseout", () => {
      this.em.dispatch("node:mouseout", this.treeNode);
      this.toggleHighlight(false);
    });
  }

  private initExpand() {
    this.body.on("mousedown", () => {
      const maxRight = getTreeMaxRight(this.treeNode);
      const newDimentions = this.onExpand();

      this.expanded = !this.expanded;

      recalculatePositions(this.treeNode, newDimentions, maxRight, this.opts);
      this.canvas.requestRenderAll();
      this.em.dispatch("node:resize", this.treeNode);
    });
  }
}
