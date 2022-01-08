import { fabric } from "fabric";

import Parser, { GraphGroupNode } from "../parser";
import { Data, Options, Colors, LinkType, GraphManager } from "../models";
import { ParanoidNode } from "../tree";
import renderLine from "../shapes/line";

import { loadFonts } from "../utils";
import {
  defaultColors,
  getCommonColors,
  NODE_MARGIN_BOTTOM,
} from "../shapes/constants";
import { NodeType } from "../constants";

function getButton(text: string, title: string) {
  const button = document.createElement("button");
  button.innerText = text;
  button.className = `paranoid-button paranoid-button_${title}`;

  return button;
}

class Graph {
  private canvas?: fabric.Canvas;
  private plus: HTMLButtonElement;
  private minus: HTMLButtonElement;
  private normalZoom: HTMLButtonElement;
  private canvRoot: HTMLElement;
  private opts: Options;
  private nodesWithChildren: Map<string, ParanoidNode[]>;
  private parser?: Parser;
  private rendered?: boolean;

  constructor(root: string, opts: Options, data: Data) {
    this.nodesWithChildren = data.links.reduce((acc, link) => {
      acc.set(link.from, []);
      return acc;
    }, new Map<string, ParanoidNode[]>());
    const elem = document.getElementById(root);

    if (!elem) {
      throw new Error(`Not found element with id ${root}`);
    }

    elem.style.position = "relative";

    this.opts = opts;

    const plus = getButton("+", "plus");
    const minus = getButton("-", "minus");
    const normalZoom = getButton("1:1", "normal");

    this.plus = plus;
    this.minus = minus;
    this.normalZoom = normalZoom;
    this.canvRoot = elem;
  }

  render(parser: Parser) {
    this.parser = parser;

    loadFonts().then(() => {
      const trees = parser.parseData();

      this.canvas = this.initCanvas();
      this.renderControllers();
      this.initZoom();
      this.initPan();

      let treeTop: number;
      let left: number;
      trees.forEach((tree) => {
        tree.setCanvas(this.canvas as fabric.Canvas);
        tree.setNodesWithChildren(this.getNodesWithChildren());
        const { nodes, bottom } = tree.getCanvasObjects(
          treeTop,
          left,
          this.opts
        );
        treeTop = bottom + NODE_MARGIN_BOTTOM;

        const links = this.getLinks();
        this.renderIntoCanvas(nodes, links);
      });
    });
  }

  updateGraph(data: Data) {
    this.parser = new Parser(data);
    this.setNodeWithChildren(data);

    const trees = this.parser.parseData();

    let treeTop: number;
    let left: number;
    trees.forEach((tree, index) => {
      tree.setCanvas(this.canvas as fabric.Canvas);
      tree.setNodesWithChildren(this.getNodesWithChildren());
      const { nodes, bottom } = tree.getCanvasObjects(treeTop, left, this.opts);
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
      this.canvas.add(...nodes, ...links);
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
    }, new Map<string, ParanoidNode[]>());
  }

  private initCanvas() {
    const canv = document.createElement("canvas");
    canv.setAttribute("id", "C");
    canv.setAttribute("width", String(this.canvRoot.offsetWidth));
    canv.setAttribute("height", String(this.canvRoot.offsetHeight));
    this.canvRoot.appendChild(canv);
    const colors = this.opts.colors || {};

    const canvas = new fabric.Canvas("C", {
      selection: false,
      backgroundColor: colors.fill,
      defaultCursor: "grab",
    });

    return canvas;
  }

  private initZoom() {
    const canvas = this.canvas as fabric.Canvas;

    this.minus.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      let zoom = canvas.getZoom();

      zoom -= 0.2;

      if (zoom < 0.2) {
        zoom = 0.2;
      }

      canvas.setZoom(zoom);
    });

    this.plus.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      let zoom = canvas.getZoom();

      zoom += 0.2;

      if (zoom > 1) {
        zoom = 1;
      }

      canvas.setZoom(zoom);
    });

    this.normalZoom.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      canvas.setZoom(1);
    });
  }

  private initPan() {
    const canvas = this.canvas as fabric.Canvas;
    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    canvas.on("mouse:down", (opt: fabric.IEvent) => {
      const evt = opt.e as MouseEvent;
      isDragging = true;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
    });

    canvas.on("mouse:move", (opt) => {
      if (isDragging) {
        const e = opt.e as MouseEvent;
        canvas.viewportTransform![4] += e.clientX - lastPosX;
        canvas.viewportTransform![5] += e.clientY - lastPosY;
        canvas.requestRenderAll();
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      }
    });

    canvas.on("mouse:up", () => {
      isDragging = false;
      canvas.getObjects().forEach((object) => object.setCoords());
    });
  }

  private renderControllers() {
    const buttons = document.createElement("div");
    const colors = this.opts.colors as Colors;

    buttons.className = "paranoid-controls";

    const style = document.createElement("style");
    style.innerText = `
            .paranoid-controls {
                position: absolute;
                top: 10px;
                right: 10px;
            }
            .paranoid-button {
                margin-left: 12px;
                border-radius: 4px;
                height: 28px;
                width: 28px;
                line-height: 13px;
                font-family: YS Text;
                font-size: 13px;
                text-align: center;
                padding: 0;
                box-shadow: 0px 2px 3px ${colors.nodeShadow};
                border: 1px solid ${colors.buttonBorderColor};
                background-color: ${colors.nodeFill};
                color: ${colors.textColor};
                cursor: pointer;
            }
            .paranoid-button:focus {
                outline: none;
            }
            .paranoid-button:active {
                border: 1px solid ${colors.buttonBorderColor};
            }
            .paranoid-button_plus {
                margin-left: 0;
                border-left: none;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
            .paranoid-button_minus {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
        `;

    buttons.appendChild(style);
    buttons.appendChild(this.minus);
    buttons.appendChild(this.plus);
    buttons.appendChild(this.normalZoom);

    this.canvRoot.appendChild(buttons);
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
          this.opts.colors as Colors,
          this.opts.linkType as LinkType
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
}

const defaultOpts: Options = {
  linkType: LinkType.Arrow,
};

export function renderGraph(domNodeId: string, data: Data, opts = defaultOpts) {
  const colors = opts.colors || {};

  // if colors palette was now povided use common colors or default palette
  const options = {
    ...opts,
    colors: { ...defaultColors, ...getCommonColors(), ...colors },
  };

  const graph = new Graph(domNodeId, options, data);
  const parser = new Parser(data);
  graph.render(parser);
  const updateManager: GraphManager = {
    updateGraph: graph.updateGraph.bind(graph),
  };

  return updateManager;
}
