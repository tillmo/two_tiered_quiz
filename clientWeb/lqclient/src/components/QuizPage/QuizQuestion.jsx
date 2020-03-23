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
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

export class QuizQuestion extends Component {
  state = {
    counter: 0,
    cardDetails: [],
    quizTitle: ""
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
    this.setState({ counter: this.state.counter - 1 });
  };

  nextQuestion = () => {
    this.setState({ counter: this.state.counter + 1 });
  };

  updateCheckedAnwers = (qno, ansId, ans, justId, just) => {
    console.log(qno+" "+ansId+" "+ans+" "+justId+" "+just);
    let cardDetails = this.state.cardDetails;
    cardDetails[qno].checkedAid = ansId;
    cardDetails[qno].checkedAns = ans;
    cardDetails[qno].checkedJustId = justId;
    cardDetails[qno].checkedJust = just;
    this.setState({cardDetails: cardDetails});
  };

  render() {
    if (this.state.cardDetails.length === 0) {
      return null;
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
            Available Quizzes
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
              onClick={this.nextQuestion}
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
              updateCheckedAnwers = {this.updateCheckedAnwers}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default QuizQuestion;
