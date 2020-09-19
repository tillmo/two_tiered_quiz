import React from "react";
import * as dc from "dc";
import "dc/dist/style/dc.min.css";
import { ChartTemplate } from "./chartTemplate";

const reduceAdd = (p, v) => {
  p.push(v.y);
  return p;
};
const reduceRemove = (p, v) => {
  p.splice(p.indexOf(v.y), 1);
  return p;
};

const reduceIntialize = () => {
  return [];
};

const boxChartFunc = (divRef, ndx) => {
  let dimensionByQuiz = ndx.dimension((d) => {
    return d.x;
  });
  let groupByPercentages = dimensionByQuiz
    .group()
    .reduce(reduceAdd, reduceRemove, reduceIntialize);
  const boxPlot = dc
    .boxPlot(divRef)
    .height(250)
    .margins({ top: 20, bottom: 40, right: 10, left: 30 })
    .dimension(dimensionByQuiz, "quiz")
    .keyAccessor(function (d) {
      return "quiz " + d.key + "(" + d.value.length + ")";
    })
    .group(groupByPercentages);
  return boxPlot;
};

const BoxChart = (props) => (
  <ChartTemplate chartFunction={boxChartFunc} title="" />
);

export default BoxChart;
