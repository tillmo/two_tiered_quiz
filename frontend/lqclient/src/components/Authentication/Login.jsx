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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { HasSessionExpired, getErrorMessage } from "../Utils/LoginUtils.js";
import { getLoginService } from "../Services/AppServices.js";
import {translate} from 'react-i18next';

function t(arg) { return arg }

export class Login extends Component {
  state = {
    username: "",
    password: "",
    open: false,
    isToken: false,
    isUserLoggedIn: false,
    openSnackBar: false,
    errorMessage: "",
    openBackDrop: false,
  };

  componentDidMount() {
    if (!HasSessionExpired()) {
      this.setState({ isUserLoggedIn: true });
    }
  }

  handle_username_change = (e) => {
    const value = e.target.value;
    this.setState({
      username: value,
    });
  };

  handle_password_change = (e) => {
    const value = e.target.value;
    this.setState({
      password: value,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };


  handleLogin = (e) => {
    e.preventDefault();
    this.setState({ openBackDrop: true });
    getLoginService({
      username: this.state.username,
      password: this.state.password,
    })
      .then((res) => {
        localStorage.setItem("token", res.data.key);
        localStorage.setItem("loggedinTime", Date.now());
        this.setState({
          isToken: true,
          openBackDrop: false,
        });
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
    const { openSnackBar, errorMessage, openBackDrop } = this.state;
    if (this.state.isUserLoggedIn) {
      return <Redirect to="/app/" />;
    }
    if (this.state.isToken) {
      return <Redirect to="/app/" />;
    }
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
            {process.env.REACT_APP_TITLE}
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
                  {t("Login")}
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
                  style={{ width: "100%" }}
                  id="outlined-basic"
                  label={t("username")}
                  variant="outlined"
                  value={this.state.username}
                  onChange={this.handle_username_change}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  style={{ width: "100%" }}
                  id="standard-password-input"
                  label={t("password")}
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  value={this.state.password}
                  onChange={this.handle_password_change}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleLogin}
                >
                  {t("Login")}
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={6} style={{ paddingTop: "15px" }}>
                <Link
                  href="/signup"
                  variant="body2"
                  style={{ marginLeft: "60px" }}
                >
                  {t("Don't have an account? Sign Up")}
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </div>
    );
  }
}

export default translate('common')(Login);
