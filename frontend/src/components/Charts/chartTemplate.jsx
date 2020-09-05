import React from "react";
import { CXContext } from "./cxContext";

export const ChartTemplate = (props) => {
  const context = React.useContext(CXContext);
  const ndx = context.ndx;
  const div = React.useRef(null);
  React.useEffect(() => {
    const newChart = props.chartFunction(div.current, ndx);
    newChart.render();
  }, [ndx]);

  return <div ref={div}></div>;
};
