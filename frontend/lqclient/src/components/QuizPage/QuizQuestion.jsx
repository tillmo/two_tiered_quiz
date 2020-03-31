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

export class QuizQuestion extends Component {
  state = {
    counter: 0,
    cardDetails: [],
    quizTitle: "",
    quizReport: [],
    showReport: false,
    score: 0,
    totalScore: 0
  };

  componentDidMount() {
    const getUrl = "http://127.0.0.1:8000/api/" + this.props.match.params.id;
    axios.get(getUrl).then(res => {
      this.setState({
        quizTitle: res.data.name,
        cardDetails: res.data.question
      });
    });
  }

  previousQuestion = () => {
    if (this.state.counter !== 0) {
      this.setState({ counter: this.state.counter - 1 });
    }
  };

  nextQuestion = () => {
    if (this.state.counter<(this.state.cardDetails.length-1)) {
    this.setState({ counter: this.state.counter + 1 });
    }
  };

  updateCheckedAnwers = (qno, ansId, ans, justId, just) => {
    let cardDetails = this.state.cardDetails;
    cardDetails[qno].checkedAid = ansId;
    cardDetails[qno].checkedAns = ans;
    cardDetails[qno].checkedJustId = justId;
    cardDetails[qno].checkedJust = just;
    this.setState({ cardDetails: cardDetails });
  };

  handleSubmitQuiz = () => {
    const questions = this.state.cardDetails;
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
        }
        var justifications = answers[j].justifications;
        for (var k = 0; k < justifications.length; k++) {
          if (justifications[k].is_correct) {
            if (obj.checkedJustId === justifications[k].id) {
              score += 5;
              obj.isCorrectJust = true;
            }
            obj.correctJustificationId = justifications[k].id;
            obj.correctJustification = justifications[k].text;
            obj.explaination = justifications[k].explaination[0].text;
          }
        }     
      }
      if (obj.checkedAid === obj.correctAid) {
        score += 5;
        obj.isCorrectAns = true;
      } 
      quizReport.push(obj);
    }
    this.setState({
      showReport: true,
      quizReport: quizReport,
      score: score,
      totalScore: totalScore
    });
  };

  render() {
    if (this.state.cardDetails.length === 0) {
      return null;
    }

    if (this.state.showReport) {
      return (
        <QuizReport
          quizTitle={this.state.quizTitle}
          quizReport={this.state.quizReport}
          score={this.state.score}
          totalScore={this.state.totalScore}
          cardDetail={this.state.cardDetails}
        />
      );
    }
    return (
      <div>
        <Breadcrumbs
          style={{
            marginLeft: "8px"
          }}
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Typography variant="subtitle2">
            <Link color="inherit" href="/">
              Home
            </Link>
          </Typography>
          <Typography variant="subtitle2" color="textPrimary">
            {this.state.quizTitle} Quiz
          </Typography>
        </Breadcrumbs>
        <Grid
          container
          spacing={1}
          style={{ justify: "space-between", marginTop: "10px" }}
        >
          <Grid item xs={12} sm={12} md={8}>
            <Typography variant="h6" color="textPrimary">
              {this.state.quizTitle} Quiz
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.handleSubmitQuiz}
              endIcon={<AssignmentTurnedInIcon />}
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={3} sm={2} md={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.previousQuestion}
              startIcon={<KeyboardArrowLeftIcon />}
            >
              Back
            </Button>
          </Grid>
          <Grid item xs={3} sm={2} md={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.nextQuestion}
              endIcon={<KeyboardArrowRightIcon />}
            >
              Next
            </Button>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <QuizQuestionCard
              key={this.state.cardDetails[this.state.counter].id}
              cardDetail={this.state.cardDetails[this.state.counter]}
              quesNo={this.state.counter}
              updateCheckedAnwers={this.updateCheckedAnwers}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default QuizQuestion;
