import _ from "lodash";
import {
  TreeNode,
  ParanoidOpts,
  Shapes,
  Shape,
  Coordinates,
  GroupControls,
  NodeSizes,
  fabric,
  ParanoidEmmiter,
} from "../../lib";

class DefaultShape implements Shape {
  private canvas: fabric.Canvas;
  private coords: Coordinates;
  private treeNode: TreeNode;
  private opts: ParanoidOpts;
  private em: ParanoidEmmiter;
  private body: fabric.Object;
  private group: fabric.Group;
  private expanded = false;
  private shadow: fabric.Shadow;
  private hoverShadow: fabric.Shadow;

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

    this.shadow = new fabric.Shadow({
      color: this.opts.colors?.nodeShadow,
      offsetY: 5,
      blur: 6,
    });
    this.hoverShadow = new fabric.Shadow({
      color: this.opts.colors?.nodeShadow,
      offsetY: 8,
      blur: 8,
    });

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
    return new fabric.Rect({
      width: NodeSizes.width,
      height: NodeSizes.height,
      fill: this.getFillColor(),
      rx: NodeSizes.borderRadius,
      ry: NodeSizes.borderRadius,
      shadow: this.getShadow(),
    });
  }

  private createGroup() {
    const { top, left } = this.coords;

    const title = new fabric.Text(_.get(this.treeNode, ["data", "name"]), {
      fontSize: NodeSizes.titleFontSize,
      lineHeight: NodeSizes.titleLineHeight,
      left: NodeSizes.paddingLeft,
      top: NodeSizes.paddingTop,
      fontFamily: "YS Text",
      fill: this.opts.colors?.titleColor,
    });

    return new fabric.Group([this.body, title], {
      left,
      top,
      ...GroupControls,
    });
  }

  private initListeners() {
    this.initHover();
    this.initExpand();
  }

  private initHover() {
    this.body.on("mouseover", () => {
      this.toggleHighlight(true);
    });

    this.body.on("mouseout", () => {
      this.toggleHighlight(false);
    });
  }

  private initExpand() {
    const em = this.em;
    const treeNode = this.treeNode;
    const canvas = this.canvas;
    const body = this.body;
    const width = NodeSizes.width;
    const height = NodeSizes.height;

    body.on("mousedown", () => {
      if (this.expanded) {
        body.set({
          fill: this.getFillColor(),
          shadow: this.getShadow(),
          width,
          height,
        });

        this.group.addWithUpdate();
        em.dispatch("node:resize", treeNode);
        this.expanded = false;
      } else {
        body.set({
          fill: this.getFillColor(),
          shadow: this.getShadow(),
          width: 360,
          height: 400,
        });

        this.group.addWithUpdate();
        em.dispatch("node:resize", treeNode);
        this.expanded = true;
      }

      canvas.renderAll();
    });
  }
}

function node(
  canvas: fabric.Canvas,
  coords: Coordinates,
  treeNode: TreeNode,
  opts: ParanoidOpts,
  em: ParanoidEmmiter
) {
  return new DefaultShape(canvas, coords, treeNode, opts, em);
}

export const shapes: Shapes = {
  node: node,
};
