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
  private expanded = false;
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
    });
  }

  private prepareShapeObjects() {
    const title = getTitle(this.data.name || "", this.opts.colors);

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
    // this.initExpand();
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
