import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { HasSessionExpired } from "../Utils/LoginUtils.js";
import {
  getQuizListService,
  getUserDetailsService,
  getquiztakerdetailsService,
} from "../Services/AppServices.js";
import { translate } from "react-i18next";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import Button from "@material-ui/core/Button";
import TablePagination from "@material-ui/core/TablePagination";

export class QuizDescription extends Component {
  state = {
    cardDetails: [],
    rows: [],
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount() {
    if (HasSessionExpired()) {
      this.props.history.push("/");
    } else {
      getQuizListService().then(async (res) => {
        const user = await getUserDetailsService();
        const quizTakerData = await getquiztakerdetailsService(user).then(
          (res) => {
            return res.data;
          }
        );
        const rowData = this.prepareQuizTableData(res.data, quizTakerData);
        this.setState({ rows: rowData });
      });
    }
  }

  prepareQuizTableData = (quizData, quizTakerData) => {
    let rowData = [];
    let buttonText = this.props.t("START");
    let quizTakerId = 0;
    let score = this.props.t("Not Attempted");
    quizData.forEach((quiz) => {
      score = this.props.t("Not Attempted");
      buttonText = this.props.t("START");
      quizTakerId = 0;
      const index = quizTakerData.findIndex(
        (quizTaker) => quizTaker.quiz === quiz.id
      );
      if (index !== -1) {
        const quizTaker = quizTakerData[index];
        quizTakerId = quizTaker.id;
        if (quizTaker.attempted) {
          score = String(quizTaker.score);
        }
        if (quizTaker && quizTaker.attempted && quizTaker.completed) {
          buttonText = this.props.t("COMPLETED");
        } else if (quizTaker && quizTaker.attempted) {
          buttonText = this.props.t("CONTINUE");
        }
      }
      rowData.push(
        this.createData(
          quiz.id,
          quiz.name,
          quiz.description,
          quiz.questions_count,
          score,
          quizTakerId,
          buttonText
        )
      );
    });
    rowData = this.rearrangeRowData(rowData);
    return rowData;
  };

  rearrangeRowData = (rowData) => {
    let rows = [];
    const startData = rowData.filter(
      (row) => row.buttonText === this.props.t("START")
    );
    const continueData = rowData.filter(
      (row) => row.buttonText === this.props.t("CONTINUE")
    );
    const completedData = rowData.filter(
      (row) => row.buttonText === this.props.t("COMPLETED")
    );
    if (startData && startData.length !== 0) rows = rows.concat(startData);
    if (continueData && continueData.length !== 0)
      rows = rows.concat(continueData);
    if (completedData && completedData.length !== 0)
      rows = rows.concat(completedData);
    return rows;
  };

  createData = (
    quizId,
    quizName,
    quizDesc,
    quizQuesCount,
    score,
    quizTakerId,
    buttonText
  ) => {
    return {
      quizId,
      quizName,
      quizDesc,
      quizQuesCount,
      score,
      quizTakerId,
      buttonText,
    };
  };

  routeToQuiz = (quizId, quizTakerId, buttonText) => (event) => {
    event.stopPropagation();
    this.props.history.push(
      "quiz/" + quizId + "/" + quizTakerId + "/" + buttonText
    );
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
                {this.props.t("Quizzes Available")}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={this.state.rows.length}
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
                  style={{ backgroundColor: "#3f51b5", color: "white" }}
                >
                  {t("Quiz")}
                </TableCell>
                <TableCell align="left" style={tableStyles}>
                  {t("Description")}
                </TableCell>
                <TableCell align="left" style={tableStyles}>
                  #
                </TableCell>
                <TableCell align="left" style={tableStyles}>
                  {t("Score")}
                </TableCell>
                <TableCell align="left" style={tableStyles}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.quizId}>
                    <TableCell align="left">
                      <Typography variant="subtitle2" color="textPrimary">
                        {row.quizName}
                      </Typography>
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ maxWidth: "34em" }}
                    >
                      {row.quizDesc}
                    </TableCell>
                    <TableCell align="left">{row.quizQuesCount}</TableCell>
                    <TableCell align="left">{row.score}</TableCell>
                    <TableCell align="left">
                      <Button
                        size="small"
                        style={{
                          marginLeft: "20px",
                          backgroundColor: "#3f51b5",
                          color: "white",
                        }}
                        variant="contained"
                        onClick={this.routeToQuiz(
                          row.quizId,
                          row.quizTakerId,
                          row.buttonText
                        )}
                        endIcon={<PlayCircleOutlineIcon />}
                      >
                        {row.buttonText}
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

export default translate("common")(QuizDescription);
