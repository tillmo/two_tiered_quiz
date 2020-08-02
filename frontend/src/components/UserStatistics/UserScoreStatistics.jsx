import React, { Component } from "react";
import * as dc from "dc";
import * as crossfilter from "crossfilter2/crossfilter";
import ApexCharts from "../Charts/ApexCharts";
import {
  getAllUserScoreChartData,
  getUserScoreDetailsService,
  getUserDetailsService,
  getUserProgressService,
  getAllUserProgressService,
  getAvgQuestionsSolvedService
} from "../Services/AppServices";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { HasSessionExpired } from "../Utils/LoginUtils.js";
import { translate } from "react-i18next";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { DataContext } from "../Charts/cxContext";
import BoxChart from "../Charts/BoxChart";

export class UserScoreStatistics extends Component {
  state = {
    allUserScoresAxisData: { xAxis: [], yAxis: [], xTitle: "", yTitle: "" },
    userProgressAxisData: { xAxis: [], yAxis: [], xTitle: "", yTitle: "" },
    allUserProgressAxisData: { xAxis: [], yAxis: [], xTitle: "", yTitle: "" },
    avgQuestionSolvedAxisData: { xAxis: [], yAxis: [], xTitle: "", yTitle: "" },
    userScoreDetails: [],
  };

  async componentDidMount() {
    if (HasSessionExpired()) {
      this.props.history.push("/");
    } else {
      const user = await getUserDetailsService();
      let scores = await getAllUserScoreChartData(this.props.quizId);
      let userScoreDetails = await getUserScoreDetailsService(user);
      let userProgress = await getUserProgressService(user);
      let allUserProgress = await getAllUserProgressService();
      let avgQuestionSolvedData = await getAvgQuestionsSolvedService();
      this._prepareUserScoreRowData(userScoreDetails);
      this._getAllUserScoresAxisData(scores.groupedScores);
      this._getUserProgressAxisData(userProgress);
      this._getAllUserProgressAxisData(allUserProgress);
      this._getAvgQuestionSolvedAxisData(avgQuestionSolvedData);
    }
  }

  _getAllUserScoresAxisData = (scores) => {
    let xAxis = [];
    let yAxis = [];
    let scoresMap = new Map();
    for (var i = 0; i < scores.length; i++) {
      let scoreCount = scoresMap.get(parseInt(scores[i].totalScore));
      if (scoreCount === undefined) {
        scoresMap.set(parseInt(scores[i].totalScore), 1);
      } else {
        scoreCount++;
        scoresMap.set(parseInt(scores[i].totalScore), scoreCount);
      }
    }
    scoresMap.forEach((value, key) => {
      xAxis.push(parseInt(key));
      yAxis.push(parseInt(value));
    });
    this.setState({
      allUserScoresAxisData: {
        xAxis: xAxis,
        yAxis: yAxis,
        xTitle: this.props.t("Score"),
        yTitle: this.props.t("Number of users"),
      },
    });
  };

  _getUserProgressAxisData = (scores) => {
    let xAxis = [];
    let yAxis = [];
    for (var i = 0; i < scores.length; i++) {
      xAxis.push(parseInt(scores[i].quiz));
      yAxis.push(parseInt(scores[i].percentage));
    }
    this.setState({
      userProgressAxisData: {
        xAxis: xAxis,
        yAxis: yAxis,
        xTitle: this.props.t("Quiz"),
        yTitle: this.props.t("Score in percentage"),
      },
    });
  };

  _getAllUserProgressAxisData = (scores) => {
    let xAxis = [];
    let yAxis = [];
    let percentage = [];
    for (var i = 0; i < scores.length; i++) {
      xAxis.push(parseInt(scores[i].quiz));
      const percentages =  scores[i].percentage;
      for (var j = 0; j < percentages.length; j++) {
        yAxis.push({ x: scores[i].quiz, y: percentages[j]});
      }
    }  
    this.setState({
      allUserProgressAxisData: {
        xAxis: xAxis,
        yAxis: yAxis,
        xTitle: this.props.t("Quiz"),
        yTitle: this.props.t("Score in percentage"),
      },
    });
  };

  _prepareUserScoreRowData = (userScoreDetails) => {
    let rowData = [];
    rowData.push(
      this.createData(this.props.t("User"), userScoreDetails.username)
    );
    rowData.push(
      this.createData(this.props.t("Total Score"), userScoreDetails.totalScore)
    );
    rowData.push(
      this.createData(
        this.props.t("Quizzes Attempted"),
        userScoreDetails.quizattempted
      )
    );
    rowData.push(
      this.createData(this.props.t("Total Quizzes"), userScoreDetails.totalquiz)
    );
    this.setState({
      userScoreDetails: rowData,
    });
  };

  _getAvgQuestionSolvedAxisData = (scores) => {
    let xAxis = [];
    let yAxis = [];
    for (var i = 0; i < scores.length; i++) {
      xAxis.push(parseInt(scores[i].quiz));
      yAxis.push(parseInt(scores[i].avg_ques_solved));
    }  
    this.setState({
      avgQuestionSolvedAxisData: {
        xAxis: xAxis,
        yAxis: yAxis,
        xTitle: this.props.t("Quiz"),
        yTitle: this.props.t("Average number of questions"),
      },
    });
  };

  createData = (key, value) => {
    return {
      key,
      value,
    };
  };

  render() {
    const tableStyles = {
      backgroundColor: "#3f51b5",
      color: "white",
    };
    const {
      allUserScoresAxisData,
      userProgressAxisData,
      allUserProgressAxisData,
      avgQuestionSolvedAxisData
    } = this.state;
    const { t } = this.props;
    return (
      <div>
        <Grid container spacing={1} style={{ justify: "space-between" }}>
          <Grid item xs={12} sm={12} md={12}>
            <Breadcrumbs
              style={{
                marginLeft: "8px",
              }}
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Typography variant="subtitle2" color="textPrimary">
                {t("User Statistics")}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          style={{ justify: "space-between", marginTop: "15px" }}
        >
          <Grid item xs={12} sm={5} md={5}>
            {this.state.userScoreDetails.length ? (
              <Paper>
                <div
                  style={{
                    backgroundColor: "#3f51b5",
                    color: "white",
                    padding: "10px",
                  }}
                >
                  {t("User Report")}
                </div>
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  style={{ minHeight: 300 }}
                >
                  <TableBody>
                    {this.state.userScoreDetails.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">
                          <Typography variant="subtitle2" color="textPrimary">
                            {row.key}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="subtitle2" color="textPrimary">
                            {row.value}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            ) : (
              <div>{t("You have not attempted any quizzes yet!")}</div>
            )}
          </Grid>
          <Grid item xs={12} sm={5} md={6}>
            <Paper>
              {userProgressAxisData.xAxis.length ? (
                <div>
                  <div
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "white",
                      padding: "10px",
                      marginBottom: "5px",
                    }}
                  >
                    {t("Score Distribution - All Users")}
                  </div>
                  <ApexCharts
                    type="bar"
                    axisData={allUserScoresAxisData}
                  ></ApexCharts>
                </div>
              ) : null}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={11}>
            <Paper>
              {userProgressAxisData.xAxis.length ? (
                <div>
                  <div
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "white",
                      padding: "10px",
                      marginBottom: "5px",
                    }}
                  >
                    {t("User Progress by Every Quiz")}
                  </div>
                  <ApexCharts
                    type="line"
                    axisData={userProgressAxisData}
                  ></ApexCharts>
                </div>
              ) : null}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={11}>
            <Paper>
              {allUserProgressAxisData.xAxis.length ? (
                <div>
                  <div
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "white",
                      padding: "10px",
                      marginBottom: "5px",
                    }}
                  >
                    {t("All Users Performance for Every Quiz")}
                  </div>
                  <div>
                    <DataContext ndxData = {allUserProgressAxisData.yAxis}>
                      <BoxChart/>
                    </DataContext>
                  </div>

                </div>
              ) : null}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={11}>
            <Paper>
              {avgQuestionSolvedAxisData.xAxis.length ? (
                <div>
                  <div
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "white",
                      padding: "10px",
                      marginBottom: "5px",
                    }}
                  >
                    {t("Average number of questions solved by a user per quiz")}
                  </div>
                  <ApexCharts
                    type="bar"
                    axisData={avgQuestionSolvedAxisData}
                  ></ApexCharts>
                </div>
              ) : null}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default translate("common")(UserScoreStatistics);
