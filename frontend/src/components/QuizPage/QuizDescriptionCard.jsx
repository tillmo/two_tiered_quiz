import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import EventNoteIcon from "@material-ui/icons/EventNote";
import {
  getquiztakerdetailsService,
  getUserDetailsService,
} from "../Services/AppServices.js";
import {translate} from 'react-i18next';

const useStyles = makeStyles({
  root: {
    margin: "10px",
    maxWidth: 630,
    borderLeft: "solild",
    borderLeftWidth: "3px",
    borderLeftColor: "#3f51b5",
    borderLeftStyle: "solid",
    borderRadius: "1px",
    minHeight: "190px",
  },
  media: {
    height: 140,
  },
  actions: {
    marginTop: "15px",
    marginLeft: "20px",
    backgroundColor: "#3f51b5",
    color: "white",
  },
});

const QuizDescriptionCard = (props) => {
  const classes = useStyles();
  const [buttonText, setButtonText] = useState("");
  const [quizTakerId, setQuizTakerId] = useState(0);

  useEffect(() => {
    let userId, quiztakerdetails;
    const { t } = props;
    const getUserDetails = async () => {
      await getUserDetailsService().then(async (res) => {
        userId = res.data.pk;
        await getquiztakerdetailsService(props.cardDetail.id, userId).then(
          (res) => {
            quiztakerdetails = res.data[0];
            if (quiztakerdetails) {
              setQuizTakerId(quiztakerdetails.id);
            }
            if (
              quiztakerdetails &&
              quiztakerdetails.attempted &&
              quiztakerdetails.completed
            ) {
              setButtonText(t("COMPLETED"));
            } else if (quiztakerdetails && quiztakerdetails.attempted) {
              setButtonText(t("CONTINUE"));
            } else {
              setButtonText(t("START"));
            }
          }
        );
      });
    };
    getUserDetails();
  }, []);

  const formatDate = (createdDate) => {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(createdDate).toLocaleDateString([], options);
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          {props.cardDetail.name}
        </Typography>
        <div style={{ minHeight: "40px" }}>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.cardDetail.description}
          </Typography>
        </div>
        <Grid
          container
          spacing={1}
          style={{ justify: "space-between", marginTop: "15px" }}
        >
          <Grid item xs={4} sm={4} md={4}>
            <div style={{ marginLeft: "13px" }}>
              <Typography variant="subtitle2" component="h2">
                {props.t("Created Date")}
              </Typography>
            </div>
            <Chip
              size="small"
              icon={<EventNoteIcon />}
              label={formatDate(props.cardDetail.created)}
              style={{ marginTop: "5px" }}
            />
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <div style={{ marginLeft: "15px" }}>
              <Typography variant="subtitle2" component="h2">
                {props.t("Questions in Quiz")}
              </Typography>
            </div>
            <div style={{ marginLeft: "40%", marginTop: "7px" }}>
              <Typography variant="body2" component="h2">
                {props.cardDetail.questions_count}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <Button
              variant="contained"
              className={classes.actions}
              endIcon={<PlayCircleOutlineIcon />}
            >
              <Link
                style={{ color: "white", textDecoration: "none" }}
                to={"quiz/" + props.cardDetail.id+"/"+quizTakerId+"/"+buttonText}
              >
                {buttonText}
              </Link>
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default translate('common')(QuizDescriptionCard);
