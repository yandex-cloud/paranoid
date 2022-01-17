import { fabric } from "fabric";

import Parser, { GraphGroupNode, Source } from "../parser";
import { Data, ParanoidOpts } from "../models";
import renderLine from "./shapes/line";

import { loadFonts } from "../utils";
import { NODE_MARGIN_BOTTOM } from "./shapes/constants";
import { NodeType } from "../constants";
import { TreeNode } from "../tree";
import { getCanvasObjects as getCompactTopologyObjects } from "../layout/compact-topology";
import { canvasId, getCanvas } from "../canvas";

export class CompactTopology {
  private canvas: fabric.Canvas;
  private opts: ParanoidOpts;
  private nodesWithChildren: Map<string, TreeNode<Source>[]>;
  private parser: Parser;
  private rendered?: boolean;

  constructor(root: string, opts: ParanoidOpts, data: Data) {
    this.nodesWithChildren = data.links.reduce((acc, link) => {
      acc.set(link.from, []);
      return acc;
    }, new Map<string, TreeNode<Source>[]>());
    this.parser = new Parser(data, opts);
    this.opts = opts;
    this.canvas = getCanvas(root, opts);
  }

  destroy() {
    const domCanvas = document.getElementById(canvasId);
    if (domCanvas) {
      this.canvas.dispose();
      domCanvas.remove();
    }
  }

  renderCompactTopology() {
    loadFonts().then(() => {
      const trees = this.parser.parseData();

      let treeTop: number;
      let left: number;
      trees.forEach((tree) => {
        tree.setCanvas(this.canvas);
        tree.setNodesWithChildren(this.getNodesWithChildren());
        const { nodes, bottom } = getCompactTopologyObjects(
          tree,
          treeTop,
          left,
          this.opts
        );
        treeTop = bottom + NODE_MARGIN_BOTTOM;

        const links = this.getLinks();
        this.renderIntoCanvas(nodes, links);
      });

      if (this.opts.initialZoomFitsCanvas) {
        this.zoomObjectsToFitCanvas();
      }
    });
  }

  updateData(data: Data) {
    this.parser = new Parser(data, this.opts);
    this.setNodeWithChildren(data);

    const trees = this.parser.parseData();

    let treeTop: number;
    let left: number;
    trees.forEach((tree, index) => {
      tree.setCanvas(this.canvas);
      tree.setNodesWithChildren(this.getNodesWithChildren());
      const { nodes, bottom } = getCompactTopologyObjects(
        tree,
        treeTop,
        left,
        this.opts
      );
      treeTop = bottom + NODE_MARGIN_BOTTOM;

      const links = this.getLinks();
      this.renderIntoCanvas(nodes, links, trees.length - 1 === index);
    });
  }

  private renderIntoCanvas(
    nodes: fabric.Object[],
    links: fabric.Group[],
    rendered?: boolean
  ) {
    if (this.canvas) {
      this.clearCanvas();
      this.canvas.add(...links, ...nodes);
      this.bringNodesToFront();
      this.rendered = rendered;
    }
  }

  private clearCanvas() {
    if (this.canvas && this.rendered) {
      try {
        this.canvas.clear();
        this.canvas.clearContext(this.canvas.getContext());
      } catch (e) {
        console.error(e);
      }
      this.rendered = false;
    }
  }

  private setNodeWithChildren(data: Data) {
    this.nodesWithChildren = data.links.reduce((acc, link) => {
      acc.set(link.from, []);
      return acc;
    }, new Map<string, TreeNode<Source>[]>());
  }

  private getNodesWithChildren() {
    const nodes = [];
    for (const k of this.nodesWithChildren.keys()) {
      nodes.push(k);
    }

    return nodes;
  }

  private getLinks() {
    const parser = this.parser;
    if (!parser) {
      return [];
    }

    return parser.data.links.reduce((acc, { from, to }) => {
      const parent = parser.nodes.get(from);
      const child = parser.nodes.get(to);

      if (!parent?.canvasNode || !child?.canvasNode) {
        return acc;
      }

      acc.push(
        renderLine(
          parent.canvasNode as fabric.Group,
          child.canvasNode as fabric.Group,
          this.opts.colors,
          this.opts.linkType
        )
      );

      return acc;
    }, [] as fabric.Group[]);
  }

  private bringNodesToFront() {
    const nodes = this.parser?.nodes;

    if (nodes) {
      nodes.forEach((node) => {
        if (
          (node.data as GraphGroupNode).type !== NodeType.Group &&
          node.canvasNode
        ) {
          node.canvasNode.bringToFront();
        }
      });
    }
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
