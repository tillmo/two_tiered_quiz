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

const useStyles = makeStyles({
  root: {
    
  },
  media: {
    height: 200
  }
});

const QuizQuestionCard = props => {
  const classes = useStyles();
  const [value, setValue] = React.useState(
    props.question.checkedAns ? props.question.checkedAns : ""
  );
  const [justificationvalue, setJustificationValue] = React.useState(
    props.question.checkedJustId ? props.question.checkedJustId : -1
  );
  const [isExpanded, setExpandedValue] = React.useState(
    props.question.checkedAid ? props.question.checkedAid : -1
  );

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleJustificationChange = (
    justId,
    ansId,
    qno,
    ans,
    just
  ) => event => {
    setJustificationValue(justId);
    props.updateCheckedAnwers(qno, ansId, ans, justId, just);
  };

  const handleExpansionChange = panelId => event => {
    setExpandedValue(panelId);
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
          value={value}
          onChange={handleChange}
        >
          {props.question.answer.map(ans => (
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
                    onClick={handleExpansionChange(ans.id)}
                    //onFocus={event => event.stopPropagation()}
                    control={<Radio />}
                    value={ans.text}
                    label={<span style={{ fontSize: "15px" }}>{ans.text}</span>}
                  />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ marginLeft: "25px" }}>
                <Typography color="textSecondary" variant="body2">
                  <Typography color="textPrimary" variant="subtitle2">
                    Justifications
                  </Typography>
                  <RadioGroup
                    aria-label={ans.text}
                    name={ans.text}
                    value={justificationvalue}
                  >
                    {ans.justifications.map(just => (
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
                        control={<Radio name={ans.text} />}
                        value={just.id}
                        label={
                          <span style={{ fontSize: "15px" }}>{just.text}</span>
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

export default QuizQuestionCard;
