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
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { green } from "@material-ui/core/colors";
import Chip from '@material-ui/core/Chip';

export class QuizReport extends Component {
  state = {
    counter: 0,
    cardDetails: [],
    quizTitle: ""
  };
  componentDidMount() {}
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
        <Grid
          container
          spacing={1}
          style={{ justify: "space-between", marginTop: "10px" }}
        >
        {this.props.quizReport.map(obj => (
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{obj.questionText}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid
                container
                spacing={1}
                style={{ justify: "space-between" }}
              >
                <Grid item xs={12} sm={12}>
                  <Typography variant="subtitle2">Checked Answer</Typography>
                </Grid>
                <Grid item xs={12} sm={12} style={{marginLeft:"15px" }}>
                  <Typography variant="body2" color="textSecondary">
                    {obj.checkedAnswer}
                    <CloseIcon color="secondary" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant="subtitle2">Correct Answer</Typography>
                </Grid>
                <Grid item xs={12} sm={12} style={{marginLeft:"15px" }}>
                  <Typography variant="body2" color="textSecondary">
                    {obj.correctAnswer}
                    <CheckIcon style={{ color: green[500] }} />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant="subtitle2">
                    Checked Justification
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} style={{marginLeft:"15px" }}>
                  <Typography variant="body2" color="textSecondary">
                    {obj.checkedJustification}
                    <CloseIcon color="secondary" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant="subtitle2">
                    Correct Justification
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} style={{marginLeft:"15px" }}>
                  <Typography variant="body2" color="textSecondary">
                    {obj.correctJustification}
                    <CheckIcon style={{ color: green[500] }} />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant="subtitle2">Explaination</Typography>
                </Grid>
                <Grid item xs={12} sm={12} style={{marginLeft:"15px" }}>
                <Chip label={obj.explaination} color="primary"/>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
        </Grid>
      </div>
    );
  }
}

export default QuizReport;
