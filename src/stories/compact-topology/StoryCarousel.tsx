import React from "react";
import { CompactTopologyWrapper } from "../../lib/components/CompactTopology";
import { Data } from "../../lib";

const opts = { initialTop: 50, initialLeft: 50, initialZoomFitsCanvas: true };
export interface StoryCarouselProps {
  datas: Data[];
}
export class StoryCarousel extends React.Component<
  StoryCarouselProps,
  { dataIndex: number }
> {
  constructor(props: StoryCarouselProps) {
    super(props);
    this.state = {
      dataIndex: 0,
    };
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={this.handleClick}>Switch plan</button>
        <CompactTopologyWrapper
          data={this.props.datas[this.state.dataIndex]}
          opts={opts}
          styles={{ height: "calc(100vh - 60px)" }}
        />
      </React.Fragment>
    );
  }

  private handleClick = () => {
    let newIndex = this.state.dataIndex + 1;

    if (newIndex > this.props.datas.length - 1) {
      newIndex = 0;
    }

    this.setState({ dataIndex: newIndex });
  };
}
