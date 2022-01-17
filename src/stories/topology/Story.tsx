import React from "react";
import { shapes } from "./shapes";
import { Data, Topology, getTopology } from "../../lib";

export class Story extends React.Component<{ data: Data }> {
  private topology?: Topology;
  componentDidMount() {
    this.topology = getTopology(
      "storyRoot",
      this.props.data,
      undefined,
      shapes
    );

    this.topology.render();
  }
  render() {
    return <div id="storyRoot" />;
  }
}
