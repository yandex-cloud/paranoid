import { defaultColors } from "./constants";
import {
  Data,
  LinkType,
  Options,
  ParanoidOpts,
  Shapes,
  TopologyNodeData,
} from "./models";
import { CompactTopology } from "./compact-topology";
import { Topology } from "./topology";

function getCommonColors() {
  const colorsMap: Record<string, string> = {
    success: "--yc-color-text-positive",
    error: "--yc-color-scarlet",
    warning: "--yc-color-amber",
    errorBackground: "--yc-color-base-danger",
    warningBackground: "--yc-color-base-warning",
    mute: "--yc-color-line-generic",
    stroke: "--yc-color-text-hint",
    fill: "--yc-color-base-generic-ultralight",
    nodeFill: "--yc-color-base-float",
    nodeShadow: "--yc-color-sfx-shadow",
    titleColor: "--yc-color-text-primary",
    textColor: "--yc-color-text-complementary",
    buttonBorderColor: "--yc-color-line-generic",
    groupBorderColor: "--yc-color-celestial-thunder",
    groupFill: "--yc-color-celestial",
    titleHoverColor: "--yc-color-text-link-hover",
    nodeHover: "--yc-color-base-float-hover",
    specialHover: "--yc-color-line-selection-active",
  };

  const style = getComputedStyle(document.body);
  const colors = Object.keys(colorsMap).reduce((acc, key) => {
    const color = style.getPropertyValue(colorsMap[key]).replace(/ /g, "");
    if (color) {
      acc[key] = color;
    }
    return acc;
  }, {} as Record<string, string>);

  const getCommonColor = (name: string) => {
    return style.getPropertyValue(`--yc-color-${name}`).replace(/ /g, "");
  };

  return { ...defaultColors, ...colors, getCommonColor };
}

const defaultOpts: Options = {
  linkType: LinkType.Arrow,
};

function prepareOptions(opts = defaultOpts) {
  const colors = opts.colors || {};
  return {
    initialTop: 10,
    initialLeft: 10,
    ...opts,
    colors: { ...defaultColors, ...getCommonColors(), ...colors },
  } as ParanoidOpts;
}

export function getCompactTopology(
  domNodeId: string,
  data: Data,
  opts?: Options
) {
  const options = prepareOptions(opts);
  return new CompactTopology(domNodeId, options, data);
}

export function getTopology<T = TopologyNodeData>(
  domNodeId: string,
  data: Data<T>,
  opts?: Options,
  shapes?: Shapes
) {
  const options = prepareOptions(opts);
  return new Topology(domNodeId, options, data, shapes);
}
