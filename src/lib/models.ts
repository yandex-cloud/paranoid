export interface GraphNode {
  name: string;
  status?: string;
  meta?: string;
  group?: string;
}

export enum LinkType {
  Arrow = "arrow",
  Line = "line",
}

export interface Link {
  from: string;
  to: string;
}

export interface Data {
  links: Link[];
  nodes: GraphNode[];
}

/*
    'success': '#07a300',
    'error': '#ff0400',
    'warning': '#ff7700',
    'mute': 'rgba(0,0,0,0.15)',
    'stroke': 'rgba(0,0,0,0.3)',
    'fill': '#fafafa',
    'nodeFill': '#ffffff',
    'nodeShadow': 'rgba(0,0,0,0.15)',
    'titleColor': '#000000',
    'textColor': 'rgba(0,0,0,0.7)',
    'buttonBorderColor': 'rgba(0,0,0,0.07)',
    'groupBorderColor': '#dcedfd',
    'groupFill': '#ebf4fe',
    'titleHoverColor:' '#004080',
*/
export interface Colors {
  success?: string;
  error?: string;
  warning?: string;
  mute?: string;
  stroke?: string;
  fill?: string;
  nodeFill?: string;
  nodeShadow?: string;
  titleColor?: string;
  textColor?: string;
  buttonBorderColor?: string;
  groupBorderColor?: string;
  groupFill?: string;
  titleHoverColor?: string;
}

export enum TextOverflow {
  Normal = "normal",
  Ellipsis = "ellipsis",
}

export interface Options {
  colors?: Colors;
  linkType?: LinkType; // default Arrow
  renderNodeTitle?: (node: GraphNode) => string;
  onTitleClick?: (node: GraphNode) => void;
  prepareCopyText?: (node: GraphNode) => string; // returns string which be copied in clipboard
  textOverflow?: TextOverflow; // default Ellipsis
}

export interface GraphManager {
  updateGraph: (data: Data) => void;
}
