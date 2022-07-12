import _ from "lodash";
import {
  ParanoidOpts,
  Coordinates,
  fabric,
  ExplainPlanNodeData,
  Shape,
} from "../../../models";
import { GroupControls } from "../../../constants";
import { TreeNode } from "../../../tree";
import { ParanoidEmmiter } from "../../../event-emmiter";
import { NodeSize } from "./constants";
import { getTitle } from "./title";
import { getStats } from "../../postgresql-explain/node/stats";
import {
  getTreeMaxRight,
  recalculatePositions,
} from "../../../layout/topology/utils";

export class ConnectionNodeShape implements Shape {
  private readonly canvas: fabric.Canvas;
  private readonly coords: Coordinates;
  private readonly treeNode: TreeNode;
  private readonly opts: ParanoidOpts;
  private readonly em: ParanoidEmmiter;
  private data: ExplainPlanNodeData;
  private objects: fabric.Object[];
  private body: fabric.Object;
  private group: fabric.Group;
  private stats?: fabric.Group;
  private expanded = false;
  private expandedNodeHeight = 0;
  private nodeHeight = 0;

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
    return this.opts.colors.getCommonColor("base-misc");
  }

  getHoverFillColor() {
    return this.opts.colors.getCommonColor("base-misc-hover");
  }

  getShadow() {
    return undefined;
  }

  getHoverShadow() {
    return undefined;
  }

  toggleHighlight(highlight: boolean) {
    if (!this.expanded) {
      this.body.set({
        fill: highlight ? this.getHoverFillColor() : this.getFillColor(),
      });
    }
    this.canvas.requestRenderAll();
  }

  private prepareNodeBody() {
    const colors = this.opts.colors;
    const lastObject = this.objects[this.objects.length - 1];

    this.nodeHeight =
      (lastObject.top || 0) + lastObject.getScaledHeight() + NodeSize.padding;

    return new fabric.Rect({
      width: NodeSize.width,
      height: this.nodeHeight,
      fill: this.getFillColor(),
      stroke: colors.getCommonColor("line-misc"),
      rx: NodeSize.borderRadius,
      ry: NodeSize.borderRadius,
      hoverCursor: this.isExpandable() ? "pointer" : "default",
    });
  }

  private prepareShapeObjects() {
    const title = getTitle(
      this.data.name || "",
      this.isExpandable(),
      this.opts.colors
    );

    return [title];
  }

  private setShapeObjectsCoords() {
    const [title] = this.objects;
    const top = NodeSize.padding;
    // const left = NodeSize.padding;

    const titleWidth = title.getScaledWidth();

    title.set({ left: NodeSize.width / 2 - titleWidth / 2, top });
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

    if (this.isExpandable()) {
      this.initExpand();
    }
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
    this.group.on("mousedown", (event) => {
      if (this.stats && event.subTargets?.includes(this.stats)) {
        return;
      }

      const maxRight = getTreeMaxRight(this.treeNode);
      const newDimensions = this.getDimensions();

      this.expanded = !this.expanded;

      recalculatePositions(this.treeNode, newDimensions, maxRight, this.opts);
      this.canvas.requestRenderAll();
      this.em.dispatch("node:resize", this.treeNode);
    });
  }

  private getDimensions() {
    const colors = this.opts.colors;

    if (this.expanded) {
      const width = NodeSize.width;
      const height = this.nodeHeight;

      this.body.set({
        width,
        height,
        fill: this.getFillColor(),
        shadow: this.getShadow(),
      });
      this.body.setCoords();
      this.group.removeWithUpdate(this.stats as fabric.Group);
      this.stats = undefined;

      return { width, height };
    } else {
      this.stats = getStats(
        this.canvas,
        this.data.stats!,
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

      this.body.setCoords();
      this.group.addWithUpdate(this.stats);

      return { width, height };
    }
  }

  private isExpandable() {
    return Boolean(this.data.stats && this.data.stats.length > 0);
  }
}
