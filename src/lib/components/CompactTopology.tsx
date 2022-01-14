import React from "react";
import { getCompactTopology } from "../main";
import { Data, Options } from "../models";
import { CompactTopology } from "../compact-topology";
import _ from "lodash";

const paranoidRoot = "paranoidRoot";
export interface CompactTopologyProps {
  data: Data;
  opts?: Options;
  styles?: React.CSSProperties;
}

export class CompactTopologyWrapper extends React.Component<CompactTopologyProps> {
  private paranoid?: CompactTopology;

  componentDidMount() {
    this.paranoid = getCompactTopology(
      paranoidRoot,
      this.props.data,
      this.props.opts
    );
    this.paranoid.renderCompactTopology();
  }

  componentDidUpdate({ data, opts }: CompactTopologyProps) {
    if (
      this.paranoid &&
      (!_.isEqual(data, this.props.data) || !_.isEqual(opts, this.props.opts))
    ) {
      this.paranoid?.destroy();
      this.paranoid = getCompactTopology(
        paranoidRoot,
        this.props.data,
        this.props.opts
      );
      this.paranoid.renderCompactTopology();
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
