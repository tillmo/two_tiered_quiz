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

export class QuizReport extends Component {
  state = {
    counter: 0,
    questions: [],
    quizTitle: ""
  };
  componentDidMount() {}

  getAnswerColor = (ansid, isCorrectAns, checkedAid) => {
    if (ansid === checkedAid) {
      if (isCorrectAns) {
        return "green";
      } else {
        return "red";
      }
    } else if (isCorrectAns) {
      return "green";
    }
  };

  getJustificationColor = (
    id,
    isCorrectJustification,
    checkedid,
    isCorrectAns
  ) => {
    if (isCorrectAns) {
      if (id === checkedid) {
        if (isCorrectJustification) {
          return "green";
        } else {
          return "red";
        }
      } else if (isCorrectJustification) {
        return "green";
      }
    } else {
      if (id === checkedid) {
        return "red";
      }
    }
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
    if (isCorrectAns) {
      if (id === checkedid) {
        if (isCorrectJustification) {
          return (
            <CheckCircleIcon style={{ marginLeft: "5px", fontSize: "small" }} />
          );
        } else {
          return (
            <CancelIcon style={{ marginLeft: "5px", fontSize: "small" }} />
          );
        }
      } else if (isCorrectJustification) {
        return (
          <CheckCircleIcon style={{ marginLeft: "5px", fontSize: "small" }} />
        );
      } else {
        return null;
      }
    } else {
      if (id === checkedid) {
        return (
          <CancelIcon style={{ marginLeft: "5px", fontSize: "small" }} />
        );
      }
    }
  };

  showExplaination = (id, isCorrectJustification, checkedid, isCorrectAns) => {
    if (id === checkedid && isCorrectAns) {
      if (isCorrectJustification) {
        return false;
      } else {
        return true;
      }
    } else if(id === checkedid) {
      return true;
    }
  };

  render() {
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
            Quiz Report
          </Typography>
        </Breadcrumbs>
        <Grid
          container
          spacing={1}
          style={{ justify: "space-between", marginTop: "10px" }}
        >
          <Grid item xs={12} sm={12} md={8}>
            <Typography variant="h6" color="textPrimary">
              {this.props.quizTitle} Quiz Report
            </Typography>
          </Grid>
        </Grid>
        <Paper style={{ padding: "10px", marginTop: "15px" }}>
          <Typography color="textPrimary" variant="subtitle2">
            Result:
            <Typography
              color="textSecondary"
              variant="subtitle2"
              style={{
                display: "inline-block",
                marginLeft: "5px"
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
              >
                <Typography>
                  {index + 1}. {obj.label}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid
                  container
                  spacing={1}
                  style={{ justify: "space-between" }}
                >
                  {obj.answer.map(ans => (
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
                              style={{
                                color: this.getAnswerColor(
                                  ans.id,
                                  ans.is_correct,
                                  obj.checkedAid
                                )
                              }}
                            >
                              {ans.text}
                              {this.getAnswerIcons(
                                ans.id,
                                ans.is_correct,
                                obj.checkedAid
                              )}
                            </div>
                          </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{ marginLeft: "15px" }}>
                          <Typography color="textPrimary" variant="body2">
                            <Typography color="textPrimary" variant="subtitle2">
                              Justifications
                            </Typography>
                            {ans.justifications.map(just => (
                              <Typography
                                style={{
                                  fontSize: "15px",
                                  marginTop: "8px",
                                  color: this.getJustificationColor(
                                    just.id,
                                    just.is_correct,
                                    obj.checkedJustId,
                                    ans.is_correct
                                  )
                                }}
                              >
                                {just.text}
                                {this.getJustificationIcons(
                                  just.id,
                                  just.is_correct,
                                  obj.checkedJustId,
                                  ans.is_correct
                                )}
                                {this.showExplaination(
                                  just.id,
                                  just.is_correct,
                                  obj.checkedJustId,
                                  ans.is_correct
                                ) ? (
                                  <Typography
                                    style={{
                                      display: "inline-block",
                                      fontSize: "15px",
                                      marginLeft: "8px"
                                    }}
                                  >
                                    <Typography
                                      color="textPrimary"
                                      variant="subtitle2"
                                      style={{ display: "inline-block" }}
                                    >
                                      Because:
                                    </Typography>
                                    <Typography
                                      color="textSecondary"
                                      variant="subtitle2"
                                      style={{
                                        display: "inline-block",
                                        marginLeft: "5px"
                                      }}
                                    >
                                      {just.explaination[0].text}
                                    </Typography>
                                  </Typography>
                                ) : null}
                              </Typography>
                            ))}
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
                {index + 1}. {obj.label} - Not Attempted
              </Typography>
            </Paper>
          )
        )}
      </div>
    );
  }
}

export default QuizReport;
