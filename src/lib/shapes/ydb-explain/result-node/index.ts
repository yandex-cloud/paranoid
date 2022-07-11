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
import { getStage } from "./stage";
import { getTitle } from "./title";

export class ResultNodeShape implements Shape {
  private readonly canvas: fabric.Canvas;
  private readonly coords: Coordinates;
  private readonly treeNode: TreeNode;
  private readonly opts: ParanoidOpts;
  private readonly em: ParanoidEmmiter;
  private data: ExplainPlanNodeData;
  private objects: fabric.Object[];
  private body: fabric.Object;
  private group: fabric.Group;
  private expanded = false;
  private shadow: fabric.Shadow;
  private hoverShadow: fabric.Shadow;
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

    this.shadow = new fabric.Shadow({
      color: opts.colors.nodeShadow,
      offsetY: 1,
      blur: 5,
    });
    this.hoverShadow = new fabric.Shadow({
      color: opts.colors.nodeShadow,
      offsetY: 3,
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

  private prepareNodeBody() {
    const colors = this.opts.colors;
    const lastObject = this.objects[this.objects.length - 1];

    this.nodeHeight =
      (lastObject.top || 0) + lastObject.getScaledHeight() + NodeSize.padding;

    return new fabric.Rect({
      width: NodeSize.width,
      height: this.nodeHeight,
      fill: this.getFillColor(),
      stroke: colors?.nodeShadow,
      rx: NodeSize.borderRadius,
      ry: NodeSize.borderRadius,
      shadow: this.getShadow(),
      hoverCursor: "default",
    });
  }

  private prepareShapeObjects() {
    const stage = getStage("Result", this.opts.colors);
    const title = getTitle([this.data.name || ""], this.opts.colors);

    return [stage, title];
  }

  private setShapeObjectsCoords() {
    const [stage, title] = this.objects;
    const top = NodeSize.padding;
    const left = NodeSize.padding;
    const titleTop = top + stage.getScaledHeight() + NodeSize.textOffset;

    stage.set({ left, top });
    title.set({ left, top: titleTop });
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
}
