import { fabric } from "fabric";
import { canvasId, getCanvas } from "../canvas";
import { Colors, Data, ParanoidOpts, Shapes } from "../models";
import Parser from "../parser";
import { loadFonts } from "../utils";
import { getCanvasObjects as getTopologyObjects } from "../layout/topology";
import { Tree } from "../tree";
import { getTopologyLinks } from "../links";
import { ParanoidEmmiter } from "../event-emmiter";
import { NODE_MARGIN_BOTTOM } from "../constants";

export class Topology {
  private canvas: fabric.Canvas;
  private opts: ParanoidOpts;
  private parser: Parser;
  private shapes?: Shapes;
  private em: ParanoidEmmiter;
  private trees: Tree[];
  private nodes: fabric.Object[];
  private links: fabric.Object[];

  constructor(root: string, opts: ParanoidOpts, data: Data, shapes?: Shapes) {
    this.canvas = getCanvas(root, opts);
    this.parser = new Parser(data, opts);
    this.opts = opts;
    this.shapes = shapes;
    this.em = new ParanoidEmmiter();
    this.trees = [];
    this.nodes = [];
    this.links = [];
    this.listenNodeResize();
  }

  render() {
    loadFonts().then(() => {
      this.trees = this.parser.parseData();
      this.renderIntoCanvas();

      if (this.opts.initialZoomFitsCanvas) {
        this.zoomObjectsToFitCanvas();
      }
    });
  }

  destroy() {
    const domCanvas = document.getElementById(canvasId);
    if (domCanvas) {
      this.canvas.dispose();
      domCanvas.remove();
    }
  }

  getEventEmmiter() {
    return this.em;
  }

  getGraphNode(name: string) {
    return this.parser.nodes.get(name);
  }

  getOpts() {
    return this.opts;
  }

  getColors() {
    return this.opts.colors as Colors;
  }

  getCanvas() {
    return this.canvas;
  }

  private renderIntoCanvas() {
    this.nodes.forEach((node) => {
      this.canvas.remove(node);
    });
    this.nodes = [];
    this.links.forEach((link) => {
      this.canvas.remove(link);
    });
    this.links = [];
    const canvHeight = this.canvas.getHeight() || 0;
    const canvWidth = this.canvas.getWidth() || 0;
    let maxBottom = canvHeight;
    let maxRight = canvWidth;

    let treeTop = this.opts.initialTop;
    const treeLeft = this.opts.initialLeft;
    this.trees.forEach((tree) => {
      tree.setCanvas(this.canvas);

      const { nodes, bottom, right } = getTopologyObjects(
        tree,
        treeTop,
        treeLeft,
        this.opts,
        this.shapes as Shapes,
        this.em
      );

      treeTop = bottom + NODE_MARGIN_BOTTOM;

      maxBottom = Math.max(bottom, maxBottom);
      maxRight = Math.max(right, maxRight);

      const links = getTopologyLinks(this.parser, this.opts);

      this.nodes.push(...nodes);
      this.links.push(...links);
      this.canvas.add(...links, ...nodes);
    });

    this.bringNodesToFront();
  }

  private bringNodesToFront() {
    const nodes = this.parser?.nodes;

    if (nodes) {
      nodes.forEach((node) => {
        if (node.canvasNode) {
          node.canvasNode.bringToFront();
        }
      });
    }
  }

  private listenNodeResize() {
    this.em.addEventListener("node:resize", () => {
      this.renderIntoCanvas();
    });
  }

  private zoomObjectsToFitCanvas() {
    let maxRight = 0;
    let maxBottom = 0;
    this.canvas.getObjects().forEach((object) => {
      const { top, left, height, width } = object.getBoundingRect();
      const right = left + width;
      const bottom = top + height;

      if (right > maxRight) {
        maxRight = right;
      }

      if (bottom > maxBottom) {
        maxBottom = bottom;
      }
    });

    maxRight += this.opts.initialLeft;
    maxBottom += this.opts.initialTop;

    const scaleX = this.canvas.getWidth() / maxRight;
    const scaleY = this.canvas.getHeight() / maxBottom;
    const scaleRatio = Math.min(scaleX, scaleY);

    if (scaleRatio < 1) {
      this.canvas.setZoom(scaleRatio);
      const currentTop = this.opts.initialTop * scaleRatio;
      const currentLeft = this.opts.initialLeft * scaleRatio;
      const panDeltaTop = this.opts.initialTop - currentTop;
      const panDeltaLeft = this.opts.initialLeft - currentLeft;
      this.canvas.relativePan(new fabric.Point(panDeltaLeft, panDeltaTop));
    }
  }
}
