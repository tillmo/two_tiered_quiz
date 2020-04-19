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
      const response = await getScoresListService(
        this.props.match.params.quizId
      );
      const rowData = this.prepareQuizTableData(response);
      const user = await getUserDetailsService();
      const index = response.findIndex((res) => res.user === user);
      if (index !== -1) {
        const score = response[index].score;
        this.setState({ userScore: score });
      }
      this.setState({ ScoresList: rowData, quizName: response[0].quiz__name });
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
          quiz.score,
          quiz.completed
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
          <Typography variant="subtitle2" color="textSecondary">
            <Link
              color="inherit"
              to="/app/dashboard/"
              style={{ textDecoration: "none" }}
            >
              {t("Dashboard")}
            </Link>
          </Typography>
          <Typography variant="subtitle2" color="textPrimary">
            {this.state.quizName} {t("Quiz")} {t("Score List")}
          </Typography>
        </Breadcrumbs>
        <Paper style={{ padding: "10px", marginTop: "15px" }}>
          <Typography color="textPrimary" variant="subtitle2">
            {t("Your score")}:
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
                : t("Not Attempted")}
            </Typography>{" "}
          </Typography>
        </Paper>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={this.state.ScoresList.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
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
                  {t("Quiz Status")}
                </TableCell>
                <TableCell align="center" style={tableStyles}>
                  {t("Score")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.ScoresList.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ).map((row, index) => (
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
                    {row.status ? t("Completed") : t("On going")}
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
