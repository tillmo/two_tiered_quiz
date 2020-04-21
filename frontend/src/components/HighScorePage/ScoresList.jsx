import React, { Component } from "react";
import { HasSessionExpired } from "../Utils/LoginUtils.js";
import { translate } from "react-i18next";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  getScoresListService,
  getUserDetailsService,
} from "../Services/AppServices.js";

export class ScoresList extends Component {
  state = {
    ScoresList: [],
    page: 0,
    rowsPerPage: 5,
    quizName: "",
    userScore: -1,
  };

  async componentDidMount() {
    if (HasSessionExpired()) {
      this.props.history.push("/");
    } else {
      const user = await getUserDetailsService();
      const response = await getScoresListService();
      const rowData = this.prepareQuizTableData(response);

      const index = response.findIndex((res) => res.user === user);
      if (index !== -1) {
        const score = response[index].totalScore;
        this.setState({ userScore: score });
      }
      this.setState({ ScoresList: rowData });
    }
  }

  prepareQuizTableData = (responseData) => {
    let rowData = [];
    responseData.forEach((quiz) => {
      rowData.push(
        this.createData(
          quiz.quiz,
          quiz.quiz__name,
          quiz.user__username,
          quiz.totalScore
        )
      );
    });
    return rowData;
  };

  createData = (quizId, quizName, username, score, status) => {
    return {
      quizId,
      quizName,
      username,
      score,
      status,
    };
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
    this.setState({ page: 0 });
  };

  render() {
    let { page, rowsPerPage } = this.state;
    const tableStyles = {
      backgroundColor: "#3f51b5",
      color: "white",
    };
    const { t } = this.props;
    return (
      <div>
        <Breadcrumbs
          style={{
            marginLeft: "8px",
          }}
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Typography variant="subtitle2" color="textPrimary">
            {t("High Score List")}
          </Typography>
        </Breadcrumbs>
        <Paper style={{ padding: "10px", marginTop: "15px" }}>
          <Typography color="textPrimary" variant="subtitle2">
            {t("Your total score")}:
            <Typography
              color="textSecondary"
              variant="subtitle2"
              style={{
                display: "inline-block",
                marginLeft: "5px",
              }}
            >
              {this.state.userScore !== -1
                ? this.state.userScore
                : t("Not attempted an quiz")}
            </Typography>{" "}
          </Typography>
        </Paper>
        <TableContainer component={Paper} style={{ height: "422px" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead style={tableStyles}>
              <TableRow>
                <TableCell
                  align="center"
                  style={{ backgroundColor: "#3f51b5", color: "white" }}
                >
                  #
                </TableCell>
                <TableCell
                  align="center"
                  style={{ backgroundColor: "#3f51b5", color: "white" }}
                >
                  {t("User")}
                </TableCell>
                <TableCell align="center" style={tableStyles}>
                  {t("Total Score")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.ScoresList.map((row, index) => (
                <TableRow key={row.quizId}>
                  <TableCell component="th" scope="row" align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" color="textPrimary">
                      {row.username}
                    </Typography>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    TableCell
                    align="center"
                  >
                    {row.score}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default translate("common")(ScoresList);
