import React, { Component } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  getUserDetailsService,
  createReportService,
  createResponseService,
  updateQuizReportService,
  updateResponseService,
} from "../Services/AppServices.js";
import {translate} from 'react-i18next';

export class QuizReport extends Component {
  state = {
    counter: 0,
    questions: [],
    quizTitle: "",
    numOfCorrectAnswers: 0,
  };

  async componentDidMount() {
    let quizTaker = await this._getQuizTakerDetails();
    if (this.props.quizTakerId === "0") {
      await createReportService(quizTaker)
        .then(async (res) => {
          let responses = this._prepareResponses(res.data[0]);
          if (responses.length) await createResponseService(responses);
        })
        .catch((err) => {
          console.log("Failed Creating quiztaker");
        });
    } else {
      await updateQuizReportService(quizTaker[0], this.props.quizTakerId).then(
        async (res) => {
          let responses = this._prepareUpdatedResponses();
          if (responses.newResponses.length)
            await createResponseService(responses.newResponses);
          if (responses.updateResponses.length)
            await updateResponseService(responses.updateResponses);
        }
      );
    }
  }

  _getQuizTakerDetails = async () => {
    var quizTaker = {};
    await getUserDetailsService().then((res) => {
      quizTaker.user = res.data.pk;
    });
    quizTaker.quiz = this.props.quizId;
    quizTaker.order = 0;
    quizTaker.score = this.props.score;
    quizTaker.completed = this._hasQuizCompleted();
    quizTaker.attempted = true;
    quizTaker.correct_answers = this.state.numOfCorrectAnswers;
    if (this.props.quizTakerId !== "0") {
      quizTaker.quizTaker = this.props.quizTakerId;
    }
    return [quizTaker];
  };

  _hasQuizCompleted = () => {
    const numOfQues = this.props.questions.length;
    let numOfQuesAnswered = 0;
    let correctAnswers = 0;
    this.props.questions.forEach((question, index) => {
      if (question.checkedAid) {
        numOfQuesAnswered++;
      }
      if (this.props.quizReport[index].isCorrectAns) {
        correctAnswers++;
      }
    });
    this.setState({ numOfCorrectAnswers: correctAnswers });
    return numOfQues === numOfQuesAnswered ? true : false;
  };

  _prepareResponses = (quizData) => {
    var responses = [];
    this.props.questions.forEach(function (question) {
      var response = {};
      if (question.checkedAid && question.checkedJustId) {
        response.quiztaker = quizData.id;
        response.question = question.id;
        response.answer = question.checkedAid;
        response.justification = question.checkedJustId;
        responses.push(response);
      }
    });
    return responses;
  };

  _prepareUpdatedResponses = () => {
    var newResponses = [];
    var updateResponses = [];
    this.props.questions.forEach((question) => {
      var response = {};
      if (question.checkedAid && question.checkedJustId) {
        response.quiztaker = this.props.quizTakerId;
        response.question = question.id;
        response.answer = question.checkedAid;
        response.justification = question.checkedJustId;
        if (question.toUpdate) updateResponses.push(response);
        if (question.isAttempted && !question.toUpdate)
          newResponses.push(response);
      }
    });
    return { newResponses, updateResponses };
  };

  getAnswerStyles = (ansid, isCorrectAns, checkedAid) => {
    var answerStyles = {};
    if (ansid === checkedAid) {
      answerStyles.color = "white";
      answerStyles.padding = "4px 6px";
      answerStyles.backgroundColor = "lightGrey";
      answerStyles.borderRadius = "3px";
      if (isCorrectAns) {
        answerStyles.color = "green";
      } else {
        answerStyles.color = "red";
      }
    } else if (isCorrectAns) {
      answerStyles.color = "green";
    }
    return answerStyles;
  };

  getJustificationStyles = (id, isCorrectJustification, checkedid) => {
    var justificationStyles = {};
    justificationStyles.fontSize = "15px";
    justificationStyles.marginTop = "8px";
    if (id === checkedid) {
      justificationStyles.color = "white";
      justificationStyles.padding = "4px 6px";
      justificationStyles.backgroundColor = "lightGrey";
      justificationStyles.borderRadius = "3px";
      if (isCorrectJustification) {
        justificationStyles.color = "green";
      } else {
        justificationStyles.color = "red";
      }
    } else if (isCorrectJustification) {
      justificationStyles.color = "green";
    }
    return justificationStyles;
  };

  getAnswerIcons = (ansid, isCorrectAns, checkedAid) => {
    if (ansid === checkedAid) {
      if (isCorrectAns) {
        return (
          <CheckCircleIcon style={{ marginLeft: "5px", fontSize: "small" }} />
        );
      } else {
        return <CancelIcon style={{ marginLeft: "5px", fontSize: "small" }} />;
      }
    } else if (isCorrectAns) {
      return (
        <CheckCircleIcon style={{ marginLeft: "5px", fontSize: "small" }} />
      );
    } else {
      return null;
    }
  };

  getJustificationIcons = (
    id,
    isCorrectJustification,
    checkedid,
    isCorrectAns
  ) => {
    if (id === checkedid) {
      if (isCorrectJustification) {
        return (
          <CheckCircleIcon style={{ marginLeft: "5px", fontSize: "small" }} />
        );
      } else {
        return <CancelIcon style={{ marginLeft: "5px", fontSize: "small" }} />;
      }
    } else if (isCorrectJustification) {
      return (
        <CheckCircleIcon style={{ marginLeft: "5px", fontSize: "small" }} />
      );
    } else {
      return null;
    }
  };

  showExplaination = (id, isCorrectJustification, checkedid) => {
    if (id === checkedid) {
      if (isCorrectJustification) {
        return false;
      } else {
        return true;
      }
    } else if (id === checkedid) {
      return true;
    }
  };

  showUserChoice = (id, isCorrect, checkedId, isAns) => {
    const { t } = this.props;
    if (id === checkedId) {
      return isAns ? t("-Your Answer") : t("-Your Justification");
    } else if (isCorrect) {
      return "";
    }
  };

  render() {
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
          <Typography variant="subtitle2">
            <Link color="inherit" href="/">
              {t("Home")}
            </Link>
          </Typography>
          <Typography variant="subtitle2" color="textPrimary">
            {t("Quiz Report")}
          </Typography>
        </Breadcrumbs>
        <Grid
          container
          spacing={1}
          style={{ justify: "space-between", marginTop: "10px" }}
        >
          <Grid item xs={12} sm={12} md={8}>
            <Typography variant="h6" color="textPrimary">
              {this.props.quizTitle} {t("Quiz Report")}
            </Typography>
          </Grid>
        </Grid>
        <Paper style={{ padding: "10px", marginTop: "15px" }}>
          <Typography color="textPrimary" variant="subtitle2">
            {t("Result:")}
            <Typography
              color="textSecondary"
              variant="subtitle2"
              style={{
                display: "inline-block",
                marginLeft: "5px",
              }}
            >
              {this.props.score}/{this.props.totalScore}
            </Typography>{" "}
          </Typography>
        </Paper>
        {this.props.questions.map((obj, index) =>
          obj.isAttempted ? (
            <ExpansionPanel style={{ marginTop: "10px" }}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls={obj.label}
                id={obj.id}
                fullWidth
              >
                <Typography>
                  {index + 1}. {obj.label}
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    style={{
                      marginLeft: "10px",
                      marginTop: "2px",
                      display: "inline-flex",
                    }}
                  >
                    {t("You chose")}
                    {this.props.quizReport[index].isCorrectAns ? (
                      <Typography
                        variant="subtitle2"
                        style={{
                          color: "green",
                          float: "right",
                          marginLeft: "8px",
                        }}
                      >
                        <CheckCircleIcon
                          style={{ marginRight: "3px", fontSize: "small" }}
                        />
                        {t("Answer")}
                      </Typography>
                    ) : (
                      <Typography
                        variant="subtitle2"
                        style={{
                          color: "red",
                          float: "right",
                          marginLeft: "8px",
                        }}
                      >
                        <CancelIcon
                          style={{ marginRight: "3px", fontSize: "small" }}
                        />
                        {t("Answer")}
                      </Typography>
                    )}
                    {this.props.quizReport[index].isCorrectJust ? (
                      <Typography
                        variant="subtitle2"
                        style={{
                          color: "green",
                          float: "right",
                          marginLeft: "8px",
                        }}
                      >
                        <CheckCircleIcon
                          style={{ marginRight: "3px", fontSize: "small" }}
                        />
                        {t("Justification")}
                      </Typography>
                    ) : (
                      <Typography
                        variant="subtitle2"
                        style={{
                          color: "red",
                          float: "right",
                          marginLeft: "8px",
                        }}
                      >
                        <CancelIcon
                          style={{ marginRight: "3px", fontSize: "small" }}
                        />
                        {t("Justification")}
                      </Typography>
                    )}
                  </Typography>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid
                  container
                  spacing={1}
                  style={{ justify: "space-between" }}
                >
                  {obj.answer.map((ans) => (
                    <Grid item xs={12} sm={12} md={12}>
                      <ExpansionPanel>
                        <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-label="Expand"
                          aria-controls={ans.text}
                          id={ans.id}
                        >
                          <Typography variant="body2">
                            <div
                              style={this.getAnswerStyles(
                                ans.id,
                                ans.is_correct,
                                obj.checkedAid
                              )}
                            >
                              {ans.text}
                              {this.getAnswerIcons(
                                ans.id,
                                ans.is_correct,
                                obj.checkedAid
                              )}
                              <Typography
                                color="textPrimary"
                                variant="subtitle2"
                                style={{
                                  display: "inline-block",
                                  marginLeft: "5px",
                                }}
                              >
                                {this.showUserChoice(
                                  ans.id,
                                  ans.is_correct,
                                  obj.checkedAid,
                                  true
                                )}
                              </Typography>
                            </div>
                          </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <Typography color="textPrimary" variant="body2">
                            <Typography color="textPrimary" variant="subtitle2">
                              {t("Justifications")}
                            </Typography>
                            <ul>
                              {ans.justifications.map((just) => (
                                <li>
                                  <Typography>
                                    <div
                                      style={this.getJustificationStyles(
                                        just.id,
                                        just.is_correct,
                                        obj.checkedJustId
                                      )}
                                    >
                                      {just.text}
                                      {this.getJustificationIcons(
                                        just.id,
                                        just.is_correct,
                                        obj.checkedJustId
                                      )}
                                      <Typography
                                        color="textPrimary"
                                        variant="subtitle2"
                                        style={{
                                          display: "inline-block",
                                          marginLeft: "5px",
                                        }}
                                      >
                                        {this.showUserChoice(
                                          just.id,
                                          just.is_correct,
                                          obj.checkedJustId,
                                          false
                                        )}
                                      </Typography>
                                    </div>
                                    {this.showExplaination(
                                      just.id,
                                      just.is_correct,
                                      obj.checkedJustId
                                    ) ? (
                                      <Typography
                                        style={{
                                          display: "inline-block",
                                          fontSize: "15px",
                                        }}
                                      >
                                        <Typography
                                          color="textPrimary"
                                          variant="subtitle2"
                                          style={{ display: "inline-block" }}
                                        >
                                          {t("Justification wrong because:")}
                                          <Typography
                                            color="textSecondary"
                                            variant="subtitle2"
                                            style={{
                                              display: "inline-block",
                                              marginLeft: "8px",
                                            }}
                                          >
                                            {just.explaination[0]
                                              ? just.explaination[0].text
                                              : ""}
                                          </Typography>
                                        </Typography>
                                      </Typography>
                                    ) : null}
                                  </Typography>
                                </li>
                              ))}
                            </ul>
                          </Typography>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </Grid>
                  ))}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ) : (
            <Paper style={{ padding: "12px 25px", marginTop: "15px" }}>
              <Typography>
                {index + 1}. {obj.label} -
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  style={{
                    display: "inline-block",
                    marginLeft: "5px",
                  }}
                >
                  {" "}
                  {t("Not Attempted")}{" "}
                </Typography>
              </Typography>
            </Paper>
          )
        )}
      </div>
    );
  }
}

export default translate('common')(QuizReport);
