import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import QuizDescriptionCard from "./QuizDescriptionCard";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

export class QuizDescription extends Component {
  state = {
    cardDetails: []
  };

  componentDidMount() {
    axios.get("http://127.0.0.1:8000/api/").then(res => {
      this.setState({ cardDetails: res.data });
    });
  }

  render() {
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
              <Typography variant="subtitle2">
                <Link color="inherit" href="/">
                  Home
                </Link>
              </Typography>
              <Typography variant="subtitle2" color="textPrimary">
                Available Quizzes
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ justify: "space-between" }}>
          {this.state.cardDetails.map(cards => (
            <Grid item xs={12} sm={12} md={6} key={cards.id}>
              <QuizDescriptionCard key={cards.id} cardDetail={cards} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default QuizDescription;
