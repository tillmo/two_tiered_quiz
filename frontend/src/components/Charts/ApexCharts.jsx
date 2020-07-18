import React, { Component } from "react";
import Chart from "react-apexcharts";

export class ApexCharts extends Component {
  state = {
    options: {
      chart: {
        id: "User Statistics charts",
      },
      xaxis: {
        title: {
          text: "",
          style: {
            fontSize: "12px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 100,
            cssClass: "apexcharts-xaxis-title",
          },
        },
        categories: [],
      },
      yaxis: {
        title: {
          text: "",
          style: {
            fontSize: "12px",
            fontFamily: "Helvetica, Arial, sans-serif",
            cssClass: "apexcharts-yaxis-title",
          },
        },
      },
    },
    series: [],
  };

  componentDidMount() {
    if (this.props.axisData && this.props.axisData.xAxis.length) {
      this.setState({
        options: {
          xaxis: {
            categories: this.props.axisData.xAxis,
            title: { text: this.props.axisData.xTitle },
          },
          yaxis: {
            title: {
              text: this.props.axisData.yTitle,
              style: { fontWeight: 100 },
            },
            show: true,
            axisBorder: {
              show: true,
              color: "lightgrey",
            },
            axisTicks: {
              show: true,
              borderType: "solid",
              color: "lightgrey",
              width: 6,
            },
          },
        },
        series: [
          {
            name: this.props.axisData.yTitle,
            data: this.props.axisData.yAxis,
          },
        ],
      });
    }
  }

  render() {
    return (
      <div>
        <Chart
          options={this.state.options}
          series={this.state.series}
          type={this.props.type}
          width={"100%"}
          height={280}
        />
      </div>
    );
  }
}

export default ApexCharts;
