import React from "react";
import * as crossfilter from "crossfilter2/crossfilter";

export const CXContext = React.createContext("CXContext");

export class DataContext extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasNDX: false };
  }

  componentDidMount() {
    if (this.props.ndxData) {
      this.ndx = crossfilter(this.props.ndxData);
      this.setState({ hasNDX: true });
    }
  }

  render() {
    if (!this.state.hasNDX) {
      return null;
    }
    return (
      <CXContext.Provider value={{ ndx: this.ndx }}>
        <div ref={this.parent}>{this.props.children}</div>
      </CXContext.Provider>
    );
  }
}
