import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Link from "@material-ui/core/Link";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {getErrorMessage} from "../Utils/LoginUtils.js";

export class SignUp extends Component {
  state = {
    formData: {
      username: "",
      email: "",
      password1: "",
      password2: "",
    },
    openSnackBar: false,
    errorMessage: "",
    openBackDrop: false,
  };

  handle_username_change = (e) => {
    const value = e.target.value;
    this.setState({
      formData: {
        ...this.state.formData,
        username: value,
      },
    });
  };

  handle_email_change = (e) => {
    const value = e.target.value;
    this.setState({
      formData: {
        ...this.state.formData,
        email: value,
      },
    });
  };

  handle_password1_change = (e) => {
    const value = e.target.value;
    this.setState({
      formData: {
        ...this.state.formData,
        password1: value,
      },
    });
  };

  handle_password2_change = (e) => {
    const value = e.target.value;
    this.setState({
      formData: {
        ...this.state.formData,
        password2: value,
      },
    });
  };

  handleLogin = (e) => {
    e.preventDefault();
    this.setState({ openBackDrop: true });
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL+"/rest-auth/registration/",
        this.state.formData
      )
      .then((res) => {
        this.setState({ openBackDrop: false });
        localStorage.setItem("token", res.data.key);
        localStorage.setItem("loggedinTime", Date.now());
        this.props.history.push("/app/");
      })
      .catch((err) => {
        var errorMessage = getErrorMessage(err);
        this.setState({
          openBackDrop: false,
          openSnackBar: true,
          errorMessage: errorMessage,
        });
      });
  };

  handleClose = () => {
    this.setState({ openSnackBar: false, errorMessage: "" });
  };

  render() {
    const { email, password1, password2 } = this.state.formData;
    const { openSnackBar, errorMessage, openBackDrop } = this.state;
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={6000}
          open={openSnackBar}
          onClose={this.handleClose}
          message={errorMessage}
        />
        <Backdrop open={openBackDrop} style={{ zIndex: 1000, color: "#fff" }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <CssBaseline />
        <Container maxWidth="sm" style={{ marginTop: "50px" }}>
          <Typography
            component="h2"
            variant="h5"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Logik Quiz
          </Typography>
          <Paper>
            <Grid
              container
              spacing={1}
              style={{
                justify: "space-between",
                marginTop: "10px",
                padding: "10px",
              }}
            >
              <Grid item xs={12} sm={12} md={12}>
                <Typography component="h2" variant="h6">
                  Sign Up
                  <LockOutlinedIcon
                    style={{
                      marginLeft: "5px",
                      fontSize: "medium",
                      color: "#1976d2",
                    }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="username"
                  variant="outlined"
                  value={this.state.formData.username}
                  onChange={this.handle_username_change}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="outlined-email-input"
                  label="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  value={email}
                  onChange={this.handle_email_change}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  label="password"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  value={password1}
                  onChange={this.handle_password1_change}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  label="confirm password"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  value={password2}
                  onChange={this.handle_password2_change}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleLogin}
                >
                  Sign Up
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={6} style={{ paddingTop: "15px" }}>
                <Link href="/" variant="body2" style={{ marginLeft: "60px" }}>
                  {"Go to Login Page"}
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </div>
    );
  }
}

export default SignUp;
