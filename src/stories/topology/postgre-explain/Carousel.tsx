import React from "react";
import {
  Data,
  getPostgresqlPlanNodeShape,
  TopologyWrapper,
} from "../../../lib";
import { explain as fullExplain } from "./format-json-analyze-buffers-timing-verbose";
import { recursivePlan } from "./recursive-plan";
import { smallPlanAnalyze } from "./small-plan-analyze";
import { smallPlan } from "./small-plan";
import { parseExplain } from "./utils";

const opts = { initialTop: 50, initialLeft: 50, initialZoomFitsCanvas: true };

export class Carousel extends React.Component<{}, { dataIndex: number }> {
  private datas: Data[];

  constructor(props: {}) {
    super(props);
    this.datas = [
      parseExplain(fullExplain),
      parseExplain(recursivePlan),
      parseExplain(smallPlanAnalyze),
      parseExplain(smallPlan),
    ];
    this.state = {
      dataIndex: 0,
    };
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={this.handleClick}>Switch plan</button>
        <TopologyWrapper
          data={this.datas[this.state.dataIndex]}
          opts={opts}
          shapes={{
            node: getPostgresqlPlanNodeShape,
          }}
          styles={{ height: "calc(100vh - 60px)" }}
        />
      </React.Fragment>
    );
  }

  private handleClick = () => {
    let newIndex = this.state.dataIndex + 1;

    if (newIndex > this.datas.length - 1) {
      newIndex = 0;
    }

    this.setState({ dataIndex: newIndex });
  };
}
