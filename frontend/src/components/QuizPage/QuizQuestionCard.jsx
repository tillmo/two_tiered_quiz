import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {translate} from 'react-i18next';

const useStyles = makeStyles({
  root: {},
  media: {
    height: 200,
  },
});

const QuizQuestionCard = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(
    props.question.checkedAid ? props.question.checkedAid : -1
  );
  const [justificationvalue, setJustificationValue] = React.useState(
    props.question.checkedJustId ? props.question.checkedJustId : -1
  );
  const [isExpanded, setExpandedValue] = React.useState(
    props.question.checkedAid ? props.question.checkedAid : -1
  );

  const handleJustificationChange = (justId, ansId, qno, ans, just) => (
    event
  ) => {
    if (!props.question.toUpdate) {
      setJustificationValue(justId);
      props.updateCheckedAnwers(qno, ansId, ans, justId, just, false);
    } else {
      event.stopPropagation();
    }
  };

  const handleExpansionChange = (panelId, qno, ans) => (event) => {
    if (!props.question.toUpdate) {
      setExpandedValue(panelId);
      props.updateCheckedAnwers(qno, panelId, ans, 0, "", true);
    } else {
      event.stopPropagation();
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          {props.quesNo + 1}.{props.question.label}
        </Typography>
        <RadioGroup
          aria-label={props.question.label}
          name={props.question.label}
          value={isExpanded}
          //onChange = {handleChange}
        >
          {props.question.answer.map((ans) => (
            <ExpansionPanel expanded={isExpanded === ans.id}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls={ans.text}
                id={ans.id}
              >
                <Typography color="textPrimary" variant="subtitle2">
                  <FormControlLabel
                    aria-label="Expand"
                    onClick={handleExpansionChange(
                      ans.id,
                      props.quesNo,
                      ans.text
                    )}
                    //onFocus={event => event.stopPropagation()}
                    control={<Radio disabled={props.question.toUpdate} />}
                    value={ans.id}
                    disabled={props.question.toUpdate}
                    label={
                      <span style={{ fontSize: "15px" }}>
                        {ans.text}
                        {props.question.toUpdate &&
                        ans.id === props.question.checkedAid
                          ? "  "+props.t("-Your Answer")
                          : ""}
                      </span>
                    }
                  />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ marginLeft: "25px" }}>
                <Typography color="textSecondary" variant="body2">
                  <Typography color="textPrimary" variant="subtitle2">
                    {props.t("Justifications")}
                  </Typography>
                  <RadioGroup
                    aria-label={ans.text}
                    name={ans.text}
                    value={justificationvalue}
                  >
                    {ans.justifications.map((just) => (
                      <FormControlLabel
                        aria-label="Expand"
                        onClick={handleJustificationChange(
                          just.id,
                          ans.id,
                          props.quesNo,
                          ans.text,
                          just.text
                        )}
                        //onFocus={event => event.stopPropagation()}
                        control={
                          <Radio
                            name={ans.text}
                            disabled={props.question.toUpdate}
                          />
                        }
                        value={just.id}
                        disabled={props.question.toUpdate}
                        label={
                          <span style={{ fontSize: "15px" }}>
                            {just.text}
                            {props.question.toUpdate &&
                            just.id === props.question.checkedJustId
                              ? "  "+props.t("-Your Justification")
                              : ""}
                          </span>
                        }
                      />
                    ))}
                  </RadioGroup>
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default translate('common')(QuizQuestionCard);
