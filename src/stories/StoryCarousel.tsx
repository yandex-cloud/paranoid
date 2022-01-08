import React from "react";

import { Data } from "..";
import StoryRoot from "./StoryRoot";

export interface StoryCaroucelProps {
  datas: Data[];
}

interface StoryCarouselState {
  dataIndex: number;
}

export default class StoryCarousel extends React.Component<
  StoryCaroucelProps,
  StoryCarouselState
> {
  interval: number;

  constructor(props: StoryCaroucelProps) {
    super(props);
    this.state = {
      dataIndex: 0,
    };
    this.interval = window.setInterval(() => {
      this.setState((prev) => {
        let dataIndex = prev.dataIndex;
        dataIndex++;

        if (dataIndex > props.datas.length - 1) {
          dataIndex = 0;
        }
        return { dataIndex };
      });
    }, 3000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { dataIndex } = this.state;

    return <StoryRoot data={this.props.datas[dataIndex]} />;
  }
}
