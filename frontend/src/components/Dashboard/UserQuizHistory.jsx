import React, { Component } from "react";
import { getUserQuizHistoryService } from "../Services/AppServices.js";
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
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

export class UserQuizHistory extends Component {
  state = { quizHistory: [], page: 0, rowsPerPage: 5 };

  async componentDidMount() {
    if (HasSessionExpired()) {
      this.props.history.push("/");
    } else {
      const response = await getUserQuizHistoryService();
      const rowData = this.prepareQuizTableData(response);
      this.setState({ quizHistory: rowData });
    }
  }

  prepareQuizTableData = (responseData) => {
    let rowData = [];
    responseData.forEach((quiz) => {
      rowData.push(
        this.createData(
          quiz.quiz,
          quiz.quiz__name,
          quiz.usersAttempted,
          quiz.highScore
        )
      );
    });
    return rowData;
  };

  createData = (quizId, quizName, usersAttempted, highScore) => {
    return {
      quizId,
      quizName,
      usersAttempted,
      highScore,
    };
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
    this.setState({ page: 0 });
  };

  routeToQuizScoreList = (quizId) => (event) => {
    event.stopPropagation();
    this.props.history.push("" + quizId + "/");
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
                {this.props.t("Dashboard")}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={this.state.quizHistory.length}
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
                  {t("Quiz")}
                </TableCell>
                <TableCell align="center" style={tableStyles}>
                  # {t("Users Attempted")}
                </TableCell>
                <TableCell align="center" style={tableStyles}>
                  {t("High Score")}
                </TableCell>
                <TableCell align="center" style={tableStyles}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.quizHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.quizId}>
                    <TableCell component="th" scope="row" align="center">
                      {index + 1}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" color="textPrimary">
                        {row.quizName}
                      </Typography>
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      TableCell
                      align="center"
                    >
                      {row.usersAttempted}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      TableCell
                      align="center"
                    >
                      {row.highScore}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        style={{
                          backgroundColor: "#3f51b5",
                          color: "white",
                        }}
                        onClick={this.routeToQuizScoreList(row.quizId)}
                        variant="contained"
                        endIcon={<PlayCircleOutlineIcon />}
                      >
                        {t("go to score list")}
                      </Button>
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

export default translate("common")(UserQuizHistory);
