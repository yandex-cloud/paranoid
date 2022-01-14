import React from "react";
import { getTopology } from "../main";
import { Data, Options, Shapes } from "../models";
import { Topology } from "../topology";
import _ from "lodash";

const paranoidRoot = "paranoidRoot";
export interface TopologyProps {
  data: Data;
  shapes: Shapes;
  opts?: Options;
  initListeners?: (paranoid: Topology) => void;
  styles?: React.CSSProperties;
}

export class TopologyWrapper extends React.Component<TopologyProps> {
  private paranoid?: Topology;

  componentDidMount() {
    // TODO: Fix incorrect calculation of canvas on fullscreen activation
    this.paranoid = getTopology(
      paranoidRoot,
      this.props.data,
      this.props.opts,
      this.props.shapes
    );
    this.paranoid.render();
    if (this.props.initListeners) {
      this.props.initListeners(this.paranoid);
    }
  }

  componentDidUpdate({ data, opts }: TopologyProps) {
    if (
      this.paranoid &&
      (!_.isEqual(data, this.props.data) || !_.isEqual(opts, this.props.opts))
    ) {
      this.paranoid?.destroy();
      this.paranoid = getTopology(
        paranoidRoot,
        this.props.data,
        this.props.opts,
        this.props.shapes
      );
      this.paranoid.render();
      if (this.props.initListeners) {
        this.props.initListeners(this.paranoid);
      }
    }
  }

  componentWillUnmount() {
    if (this.paranoid) {
      this.paranoid.destroy();
    }
  }

  render() {
    const { styles } = this.props;

    return (
      <div id={paranoidRoot} style={styles ? styles : { height: "100%" }} />
    );
  }
}
