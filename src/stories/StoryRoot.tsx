import React from "react";
import { radios } from "@storybook/addon-knobs";

import { renderGraph, Colors, Data, TextOverflow } from "..";
import { renderTitle, onTitleClick, prepareCopyText } from "./utils";
import { LinkType, GraphNode, GraphManager } from "../lib/models";

const lightColors = {
  success: "rgba(59, 201, 53, 0.75)",
  error: "#ff0400",
  warning: "#ff7700",
  mute: "rgba(0,0,0,0.15)",
  stroke: "rgba(0,0,0,0.3)",
  fill: "#fafafa",
  nodeFill: "#ffffff",
  nodeShadow: "rgba(0,0,0,0.15)",
  titleColor: "#000000",
  textColor: "rgba(0,0,0,0.7)",
  buttonBorderColor: "rgba(0,0,0,0.07)",
};

const darkColors = {
  success: "rgba(59,201,53,0.75)",
  error: "#bf3230",
  warning: "#cc6810",
  mute: "rgba(255,255,255,0.15)",
  stroke: "rgba(255,255,255,0.17)",
  fill: "#313037",
  nodeFill: "#3b3a41",
  nodeShadow: "rgba(0,0,0,0.2)",
  titleColor: "rgba(255,255,255,0.7)",
  textColor: "rgba(255,255,255,0.55)",
  buttonBorderColor: "rgba(255,255,255,0.07)",
};

const options = {
  Light: "light",
  Dark: "dark",
};

export interface ParanoidRootProps {
  linkType?: LinkType;
  renderNodeTitle?: (node: GraphNode) => string;
  colors?: Colors;
  textOverflow?: TextOverflow;
  data: Data;
}

export interface StoryRootProps extends ParanoidRootProps {}

export default function StoryRoot(props: StoryRootProps) {
  const theme = radios("Theme", options, "light");
  const colors = theme === options.Light ? lightColors : darkColors;
  return <ParanoidRoot colors={colors} {...props} />;
}

export class ParanoidRoot extends React.Component<ParanoidRootProps> {
  private gm?: GraphManager;
  componentDidMount() {
    const { data, colors, linkType, textOverflow, renderNodeTitle } =
      this.props;
    this.gm = renderGraph("storyRoot", data, {
      colors,
      linkType,
      renderNodeTitle: renderNodeTitle || renderTitle,
      onTitleClick,
      prepareCopyText,
      textOverflow,
    });
  }

  componentDidUpdate(prevProps: ParanoidRootProps) {
    if (
      JSON.stringify(prevProps.colors) !== JSON.stringify(this.props.colors)
    ) {
      const storyRoot = document.getElementById("storyRoot");

      if (!storyRoot) {
        throw new Error("Can't find element with id #storyRoot");
      }

      storyRoot.innerHTML = "";

      const { data, colors, linkType, textOverflow, renderNodeTitle } =
        this.props;
      this.gm = renderGraph("storyRoot", data, {
        colors,
        linkType,
        renderNodeTitle: renderNodeTitle || renderTitle,
        onTitleClick,
        prepareCopyText,
        textOverflow,
      });
    } else if (this.props.data !== prevProps.data && this.gm) {
      this.gm.updateGraph(this.props.data);
    }
  }
  render() {
    return <div id="storyRoot" />;
  }
}
