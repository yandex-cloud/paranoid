import { ParanoidEmmiter } from "./event-emmiter";
import { TreeNode } from "./tree";
export { fabric } from "fabric";

export interface Metric {
  name: string;
  value: string;
  theme?: "warning" | "danger";
}

export interface GraphNode<TData = any> {
  name: string;
  status?: string;
  meta?: string;
  group?: string;
  data?: TData;
  metrics?: Metric[];
}

export enum LinkType {
  Arrow = "arrow",
  Line = "line",
}

export interface Link {
  from: string;
  to: string;
}

export interface Data<TData = any> {
  links: Link[];
  nodes: GraphNode<TData>[];
}

export interface Colors {
  success?: string; //default #07a300
  error?: string; //default #ff0400
  warning?: string; //default #ff7700
  errorBackground?: string; // default rgba(235,50,38,0.08)
  warningBackground?: string; // default rgba(255,219,77,0.3)
  mute?: string; //default rgba(0,0,0,0.15)
  stroke?: string; //default rgba(0,0,0,0.3)
  fill?: string; //default #fafafa
  nodeFill?: string; //default #ffffff
  nodeShadow?: string; //default rgba(0,0,0,0.15)
  titleColor?: string; //default #000000
  textColor?: string; //default rgba(0,0,0,0.7)
  buttonBorderColor?: string; //default rgba(0,0,0,0.07)
  groupBorderColor?: string; //default #dcedfd
  groupFill?: string; //default #ebf4fe
  titleHoverColor?: string; //default #004080
  nodeHover?: string; //default rgba(0,0,0,0.15)
  specialHover?: string; //default rgba(2,123,243,1)
}

export interface EnhancedColors extends Colors {
  getCommonColor(name: string): string;
}

export enum TextOverflow {
  Normal = "normal",
  Ellipsis = "ellipsis",
}

export interface Options {
  colors?: Colors;
  maxZoom?: number; // default 2;
  minZoom?: number; // default 0.2;
  zoomStep?: number; // default 0.2;
  startZoom?: number; // default 1;
  initialTop?: number; // default 10;
  initialLeft?: number; // default 10;
  initialZoomFitsCanvas?: boolean; // default false;

  /* ========Compact-topology only======== */
  linkType?: LinkType; // default Arrow
  /* Compact-topology only */
  renderNodeTitle?: (node: GraphNode) => string;
  /* Compact-topology only */
  onTitleClick?: (node: GraphNode) => void;
  /* Compact-topology only */
  prepareCopyText?: (node: GraphNode) => string; // returns string which be copied in clipboard
  /* Compact-topology only */
  textOverflow?: TextOverflow; // default Ellipsis
}

export interface ParanoidOpts extends Options {
  colors: EnhancedColors;
  initialTop: number;
  initialLeft: number;
}

export interface Coordinates {
  top: number;
  left: number;
}

export abstract class Shape {
  abstract getShape(): fabric.Object;
  abstract getFillColor(): string | undefined;
  abstract getHoverFillColor(): string | undefined;
  abstract getShadow(): fabric.Shadow | undefined;
  abstract getHoverShadow(): fabric.Shadow | undefined;
  abstract toggleHighlight(highlight: boolean): void;
}

export interface Shapes {
  node: (
    canvas: fabric.Canvas,
    coords: Coordinates,
    node: TreeNode,
    opts: ParanoidOpts,
    em: ParanoidEmmiter
  ) => Shape;
}

export interface TopologyNodeDataStatsItem {
  name: string;
  value: string | number;
}

export interface TopologyNodeDataStatsSection {
  name: string;
  items: TopologyNodeDataStatsItem[];
}

export interface TopologyNodeDataStats {
  group: string;
  stats: TopologyNodeDataStatsSection[] | TopologyNodeDataStatsItem[];
}

export interface TopologyNodeTag {
  value: string;
  theme: "warn" | "danger";
}

export interface TopologyNodeData {
  name: string;
  time: number;
  percent: number;
  meta?: { key?: string; items: Array<string | number> };
  stats: TopologyNodeDataStats[];
  tags: TopologyNodeTag[];
}

export interface ExplainPlanNodeData {
  id?: number;
  type: "result" | "stage" | "connection";
  name?: string;
  operators?: string[];
  tables?: string[];
  stats?: TopologyNodeDataStats[];
}
