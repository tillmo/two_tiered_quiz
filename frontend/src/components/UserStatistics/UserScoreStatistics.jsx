import React, { Component } from "react";
import ApexCharts from "../Charts/ApexCharts";
import {
  getAllUserScoreChartData,
  getUserScoreDetailsService,
  getUserDetailsService,
  getUserProgressService,
  getAllUserProgressService,
  getAvgQuestionsSolvedService,
  getAllQuizAttemptsChartData,
  getTotalParticipants,
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
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import Button from "@material-ui/core/Button";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 5 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export class UserScoreStatistics extends Component {
  state = {
    allUserScoresAxisData: { xAxis: [], yAxis: [], xTitle: "", yTitle: "" },
    userProgressAxisData: { xAxis: [], yAxis: [], xTitle: "", yTitle: "" },
    allUserProgressAxisData: { xAxis: [], yAxis: [], xTitle: "", yTitle: "" },
    avgQuestionSolvedAxisData: { xAxis: [], yAxis: [], xTitle: "", yTitle: "" },
    allQuizAttemptsChartData: {
      xAxis: [],
      yAxis: [],
      xTitle: "",
      yTitle: "",
    },
    allUserProgressYAxisData: {},
    bcStartIndex: 0,
    bcEndIndex: 6,
    userScoreDetails: [],
    value: 0,
    totalParticipants: 0,
    totalParticipantsInOneQuiz: 0,
  };

  async componentDidMount() {
    if (HasSessionExpired()) {
      this.props.history.push("/");
    } else {
      const { bcEndIndex } = this.state;
      const user = await getUserDetailsService();
      let scores = await getAllUserScoreChartData(this.props.quizId);
      let userScoreDetails = await getUserScoreDetailsService(user);
      let userProgress = await getUserProgressService(user);
      let allUserProgress = await getAllUserProgressService();
      let avgQuestionSolvedData = await getAvgQuestionsSolvedService();
      let allQuizAttempts = await getAllQuizAttemptsChartData();
      let totalParticipants = await getTotalParticipants();
      const end =
        bcEndIndex < allUserProgress.length - 1
          ? bcEndIndex
          : allUserProgress.length - 1;
      this._prepareUserScoreRowData(userScoreDetails);
      this._getAllUserScoresAxisData(scores.groupedScores);
      this._getUserProgressAxisData(userProgress);
      this._getAllUserProgressAxisData(allUserProgress, 0, end);
      this._getAvgQuestionSolvedAxisData(avgQuestionSolvedData);
      this._getAllQuizAttemptsChartData(allQuizAttempts.groupedQuizzes);
      this.setState({
        allUserProgressYAxisData: allUserProgress,
        bcEndIndex: end,
        totalParticipants: totalParticipants.totalUsers,
      });
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  _getAllUserScoresAxisData = (scores) => {
    let xAxis = [];
    let yAxis = [];
    let scoresMap = new Map();
    let totalParticipantsInOneQuiz = 0;
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
      totalParticipantsInOneQuiz = totalParticipantsInOneQuiz + value;
    });
    this.setState({
      allUserScoresAxisData: {
        xAxis: xAxis,
        yAxis: yAxis,
        xTitle: this.props.t("Score"),
        yTitle: this.props.t("Number of users"),
      },
      totalParticipantsInOneQuiz: totalParticipantsInOneQuiz,
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

  _getAllUserProgressAxisData = (scores, start, end) => {
    let xAxis = [];
    let yAxis = [];
    let subScores = scores.slice(start, end + 1);
    for (var i = 0; i < subScores.length; i++) {
      xAxis.push(parseInt(subScores[i].quiz));
      const percentages = subScores[i].percentage;
      for (var j = 0; j < percentages.length; j++) {
        yAxis.push({ x: subScores[i].quiz, y: percentages[j] });
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
      yAxis.push(scores[i].avg_ques_solved.toFixed(2));
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

  _showPreviousQuizzes = () => {
    const endIndexDiff = Math.abs(
      this.state.bcStartIndex - this.state.allUserProgressYAxisData.length - 1
    );
    let start = this.state.bcStartIndex - 6;
    start = start < 0 ? 0 : start;
    let end = this.state.bcEndIndex + endIndexDiff - 6;
    end =
      end < this.state.allUserProgressYAxisData.length - 1
        ? end
        : this.state.allUserProgressYAxisData.length - 1;
    this._getAllUserProgressAxisData(
      this.state.allUserProgressYAxisData,
      start,
      end
    );
    this.setState({ bcStartIndex: start, bcEndIndex: end });
  };

  _showNextQuizzes = () => {
    let start = this.state.bcStartIndex + 6;
    start =
      start > this.state.allUserProgressYAxisData.length - 1
        ? this.state.allUserProgressYAxisData.length
        : start;
    let end = this.state.bcEndIndex + 6;
    end =
      end > this.state.allUserProgressYAxisData.length - 1
        ? this.state.allUserProgressYAxisData.length - 1
        : end;
    this._getAllUserProgressAxisData(
      this.state.allUserProgressYAxisData,
      start,
      end
    );
    this.setState({ bcStartIndex: start, bcEndIndex: end });
  };

  _getAllQuizAttemptsChartData = (userQuizes) => {
    let xAxis = [];
    let yAxis = [];
    let quizMap = new Map();
    for (var i = 0; i < userQuizes.length; i++) {
      let quizCount = quizMap.get(parseInt(userQuizes[i].totalQuizzes));
      if (quizCount === undefined) {
        quizMap.set(parseInt(userQuizes[i].totalQuizzes), 1);
      } else {
        quizCount++;
        quizMap.set(parseInt(userQuizes[i].totalQuizzes), quizCount);
      }
    }
    quizMap.forEach((value, key) => {
      xAxis.push(parseInt(key));
      yAxis.push(parseInt(value));
    });
    this.setState({
      allQuizAttemptsChartData: {
        xAxis: xAxis,
        yAxis: yAxis,
        xTitle: this.props.t("Number of quizzes attempted"),
        yTitle: this.props.t("Number of users"),
      },
    });
  };

  render() {
    const {
      allUserScoresAxisData,
      userProgressAxisData,
      allUserProgressAxisData,
      avgQuestionSolvedAxisData,
      allUserProgressYAxisData,
      allQuizAttemptsChartData,
      totalParticipants,
      totalParticipantsInOneQuiz,
      value,
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
                {t("Statistics")}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <div style={{ flexGrow: 1, backgroundColor: "white" }}>
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label={t("User Statistics")} />
              <Tab label={t("Overall Users Statistics")} />
            </Tabs>
          </AppBar>
          {value === 0 && (
            <TabContainer>
              <Grid
                container
                spacing={3}
                style={{ justify: "space-between", marginTop: "15px" }}
              >
                <Grid item xs={12} sm={4} md={4}>
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
                                <Typography
                                  variant="subtitle2"
                                  color="textPrimary"
                                >
                                  {row.key}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography
                                  variant="subtitle2"
                                  color="textPrimary"
                                >
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
                <Grid item xs={12} sm={8} md={8}>
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
              </Grid>
            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer>
              <Grid
                container
                spacing={3}
                style={{ justify: "space-between", marginTop: "15px" }}
              >
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                  style={{ marginLeft: "12px" }}
                >
                  {t("Total number of users")}:
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    style={{
                      display: "inline-block",
                      marginLeft: "5px",
                    }}
                  >
                    {totalParticipants}
                  </Typography>{" "}
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                  style={{ marginLeft: "12px" }}
                >
                  {t("Total number of users attempted a quiz")}:
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    style={{
                      display: "inline-block",
                      marginLeft: "5px",
                    }}
                  >
                    {totalParticipantsInOneQuiz}
                  </Typography>{" "}
                </Typography>
                <Grid item xs={12} sm={12} md={12}>
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
                <Grid item xs={12} sm={12} md={12}>
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
                          <Typography variant="subtitle2" color="textPrimary">
                            <Button
                              variant="contained"
                              color={
                                this.state.bcStartIndex !== 0
                                  ? "primary"
                                  : "disabled"
                              }
                              size="small"
                              disabled={this.state.bcStartIndex <= 0}
                              style={{ marginLeft: "10px" }}
                              onClick={this._showPreviousQuizzes}
                              startIcon={<KeyboardArrowLeftIcon />}
                            >
                              {t("Back")}
                            </Button>
                            {"  " + (this.state.bcStartIndex + 1)} -{" "}
                            {this.state.bcEndIndex + 1}{" "}
                            {t("of") +
                              " " +
                              allUserProgressYAxisData.length +
                              " " +
                              t("Quizzes")}
                            <Button
                              variant="contained"
                              size="small"
                              color={
                                allUserProgressYAxisData.length - 1 >=
                                this.state.bcEndIndex
                                  ? "primary"
                                  : "disabled"
                              }
                              style={{ marginLeft: "10px" }}
                              disabled={
                                allUserProgressYAxisData.length - 1 <=
                                this.state.bcEndIndex
                              }
                              onClick={this._showNextQuizzes}
                              endIcon={<KeyboardArrowRightIcon />}
                            >
                              {t("Next")}
                            </Button>
                          </Typography>
                        </div>

                        <div>
                          <DataContext ndxData={allUserProgressAxisData.yAxis}>
                            <BoxChart />
                          </DataContext>
                        </div>
                      </div>
                    ) : null}
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
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
                          {t(
                            "Average number of questions correctly solved by a user per quiz"
                          )}
                        </div>
                        <ApexCharts
                          type="bar"
                          axisData={avgQuestionSolvedAxisData}
                        ></ApexCharts>
                      </div>
                    ) : null}
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Paper>
                    {allQuizAttemptsChartData.xAxis.length ? (
                      <div>
                        <div
                          style={{
                            backgroundColor: "#3f51b5",
                            color: "white",
                            padding: "10px",
                            marginBottom: "5px",
                          }}
                        >
                          {t("Quizzes Attempts Distribution - All Users")}
                        </div>
                        <ApexCharts
                          type="bar"
                          axisData={allQuizAttemptsChartData}
                        ></ApexCharts>
                      </div>
                    ) : null}
                  </Paper>
                </Grid>
              </Grid>
            </TabContainer>
          )}
        </div>
      </div>
    );
  }
}

UserScoreStatistics.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default translate("common")(UserScoreStatistics);
