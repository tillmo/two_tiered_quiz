import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import QuizQuestionCard from "./QuizQuestionCard";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import QuizReport from "./QuizReport";
import QuizSubmitConfirmDialog from "./QuizSubmitConfirmDialog";
import { HasSessionExpired } from "../Utils/LoginUtils.js";
import {
  getQuizService,
  getQuizTakerResponsesService,
} from "../Services/AppServices.js";
import Snackbar from "@material-ui/core/Snackbar";
import {translate} from 'react-i18next';

function t(arg) { return arg }

export class QuizQuestion extends Component {
  state = {
    counter: 0,
    questions: [],
    quizTitle: "",
    quizReport: [],
    showReport: false,
    score: 0,
    totalScore: 0,
    openConfirmDialog: false,
    openSnackBar: false,
    errorMessage: "",
  };

  componentDidMount() {
    if (HasSessionExpired()) {
      this.props.history.push("/");
    } else {
      getQuizService(this.props.match.params.id).then(async (res) => {
        let questions = res.data.question;
        let responseData;
        if (this.props.match.params.quizTakerId !== "0") {
          responseData = await getQuizTakerResponsesService(
            this.props.match.params.quizTakerId
          );
        }
        console.log(responseData);
        for (var i = 0; i < questions.length; i++) {
          questions[i].isAttempted = false;
          questions[i].toUpdate = false;
          questions[i].responseId = 0;
        }
        if (responseData) {
          const responses = responseData.responses;
          for (var i = 0; i < questions.length; i++) {
            const index = responses.findIndex(
              (response) => response.question === questions[i].id
            );
            if (index !== -1) {
              questions[i].isAttempted = true;
              questions[i].checkedAid = responses[index].answer;
              questions[i].checkedJustId = responses[index].justification;
              questions[i].toUpdate = true;
              questions[i].responseId = responses[index].id;
            }
          }
        }
        this.setState({
          quizTitle: res.data.name,
          questions: questions,
        });

        if (this.props.match.params.isQuizComplete === "COMPLETED") {
          this.handleSubmitQuiz();
        }
      });
    }
  }

  previousQuestion = () => {
    if (this.state.counter !== 0) {
      this.setState({ counter: this.state.counter - 1 });
    }
  };

  nextQuestion = () => {
    if (this.state.counter < this.state.questions.length - 1) {
      this.setState({ counter: this.state.counter + 1 });
    }
  };

  updateCheckedAnwers = (qno, ansId, ans, justId, just) => {
    let questions = this.state.questions;
    questions[qno].isAttempted = true;
    questions[qno].checkedAid = ansId;
    questions[qno].checkedAns = ans;
    questions[qno].checkedJustId = justId;
    questions[qno].checkedJust = just;

    this.setState({ cardDetails: questions });
  };

  handleSubmitQuiz = () => {
    const questions = this.state.questions;
    let quizReport = [];
    let score = 0;
    let totalScore = 10 * questions.length;
    for (var i = 0; i < questions.length; i++) {
      var obj = {};
      obj.isCorrectAns = false;
      obj.isCorrectJust = false;
      obj.qno = i + 1;
      obj.questionText = questions[i].label;
      obj.checkedAnswer = questions[i].checkedAns;
      obj.checkedJustification = questions[i].checkedJust;
      obj.checkedAid = questions[i].checkedAid;
      obj.checkedJustId = questions[i].checkedJustId;
      var answers = questions[i].answer;
      for (var j = 0; j < answers.length; j++) {
        if (answers[j].is_correct) {
          obj.correctAnswer = answers[j].text;
          obj.correctAid = answers[j].id;
          var justifications = answers[j].justifications;
          for (var k = 0; k < justifications.length; k++) {
            if (justifications[k].is_correct) {
              if (obj.checkedJustId === justifications[k].id) {
                score += 5;
                obj.isCorrectJust = true;
                obj.correctJustificationId = justifications[k].id;
                obj.correctJustification = justifications[k].text;
                if (justifications[k].explaination[0]) {
                  obj.explaination = justifications[k].explaination[0].text;
                }
              }
            }
          }
        }
      }
      if (
        obj.checkedAid &&
        obj.correctAid &&
        obj.checkedAid === obj.correctAid
      ) {
        score += 5;
        obj.isCorrectAns = true;
      }
      quizReport.push(obj);
    }
    this.setState({
      showReport: true,
      quizReport: quizReport,
      score: score,
      totalScore: totalScore,
    });
  };

  _hasAllJustificationsSelected = () => {
    const questions = this.state.questions;
    let isJustificationNotSelected = false;
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].checkedAid) {
        if (!questions[i].checkedJustId) {
          isJustificationNotSelected = true;
          break;
        }
      }
    }
    return isJustificationNotSelected;
  };

  openQuizSubmitConfirmDialog = () => {
    if (this._hasAllJustificationsSelected()) {
      this.setState({
        openSnackBar: true,
        errorMessage:
          t("Please select justifications for selected answers before submit"),
      });
    } else {
      this.setState({ openConfirmDialog: true });
    }
  };

  handleDialogClose = () => {
    this.setState({ openConfirmDialog: false });
  };

  handleClose = () => {
    this.setState({ openSnackBar: false, errorMessage: "" });
  };

  render() {
    const counter = this.state.counter;
    const noOfQuestions = this.state.questions.length - 1;
    const { openSnackBar, errorMessage } = this.state;
    if (this.state.questions.length === 0) {
      return (
        <Typography variant="h6" color="textPrimary">
          {t("No Questions")}
        </Typography>
      );
    }

    if (this.state.showReport) {
      return (
        <QuizReport
          quizId={this.props.match.params.id}
          quizTitle={this.state.quizTitle}
          quizReport={this.state.quizReport}
          score={this.state.score}
          totalScore={this.state.totalScore}
          questions={this.state.questions}
          quizTakerId={this.props.match.params.quizTakerId}
        />
      );
    }

    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={6000}
          open={openSnackBar}
          onClose={this.handleClose}
          message={errorMessage}
        />
        <Breadcrumbs
          style={{
            marginLeft: "8px",
          }}
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Typography variant="subtitle2">
            <Link color="inherit" href="/">
              {t("Home")}
            </Link>
          </Typography>
          <Typography variant="subtitle2" color="textPrimary">
            {this.state.quizTitle} {t("Quiz")}
          </Typography>
        </Breadcrumbs>
        <Grid
          container
          spacing={1}
          style={{ justify: "space-between", marginTop: "10px" }}
        >
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6" color="textPrimary">
              {this.state.quizTitle} {t("Quiz")}
            </Typography>
          </Grid>
          <Grid item xs={7} sm={7} md={7}>
            <Button
              variant="contained"
              color={counter !== 0 ? "primary" : "disabled"}
              size="small"
              disabled={counter === 0}
              onClick={this.previousQuestion}
              startIcon={<KeyboardArrowLeftIcon />}
            >
              {t("Back")}
            </Button>
            <Button
              variant="contained"
              color={counter < noOfQuestions ? "primary" : "disabled"}
              size="small"
              style={{ marginLeft: "10px" }}
              onClick={this.nextQuestion}
              disabled={counter >= noOfQuestions}
              endIcon={<KeyboardArrowRightIcon />}
            >
              {t("Next")}
            </Button>
          </Grid>
          <Grid item xs={5} sm={5} md={5}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{
                float: "right",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={this.openQuizSubmitConfirmDialog}
              endIcon={<AssignmentTurnedInIcon />}
            >
              {t("Submit Quiz")}
            </Button>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <QuizQuestionCard
              key={this.state.questions[this.state.counter].id}
              question={this.state.questions[this.state.counter]}
              quesNo={this.state.counter}
              updateCheckedAnwers={this.updateCheckedAnwers}
            />
          </Grid>
        </Grid>
        <QuizSubmitConfirmDialog
          dialogOpen={this.state.openConfirmDialog}
          handleClose={this.handleDialogClose}
          submitQuiz={this.handleSubmitQuiz}
        />
      </div>
    );
  }
}

export default translate('common')(QuizQuestion);
