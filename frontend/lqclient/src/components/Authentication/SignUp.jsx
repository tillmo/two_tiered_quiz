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
import { BrowserRouter as Redirect } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";

export class SignUp extends Component {
  state = {
      formData : {
        username: "",
        email:"",
        password1: "",
        password2:""
      },
    isToken: false
  };

  handle_username_change = e => {
    const value = e.target.value;    
    this.setState({
        formData: {
            ...this.state.formData,
            username: value,
          },
    });
  };

  handle_email_change = e => {
    const value = e.target.value;    
    this.setState({
        formData: {
            ...this.state.formData,
            email: value,
          },
    });
  };

  handle_password1_change = e => {
    const value = e.target.value;
    this.setState({
        formData: {
            ...this.state.formData,
            password1: value,
          },
    });
  };

  handle_password2_change = e => {
    const value = e.target.value;
    this.setState({
        formData: {
            ...this.state.formData,
            password2: value,
          },
    });
  };

 
  handleLogin = e => {
    e.preventDefault();
    console.log(this.state.formData);
    axios
      .post("http://127.0.0.1:8000/rest-auth/registration/", this.state.formData)
      .then(res => {
        console.log(res.data);
        localStorage.setItem("token", res.data.key);
        this.setState({
          isToken: true
        });
      })
      .catch(err => {
        console.log("invalid credentials");
      });
  };

  render() {
    if (this.state.isToken) {
        return <Redirect to="/"/>;
    }
    return (
      <div>
        <CssBaseline />
        <Container maxWidth="sm" style={{ marginTop: "50px" }}>
          <Typography
            component="h2"
            variant="h5"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
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
                padding: "10px"
              }}
            >
              <Grid item xs={12} sm={12} md={12}>
                <Typography component="h2" variant="h6">
                  Sign Up
                  <LockOutlinedIcon
                    style={{
                      marginLeft: "5px",
                      fontSize: "medium",
                      color: "#1976d2"
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
                  value={this.state.username}
                  onChange={this.handle_username_change}
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
                  value={this.state.email}
                  onChange={this.handle_email_change}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  id="standard-password-input"
                  label="password"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  value={this.state.password}
                  onChange={this.handle_password1_change}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  id="standard-password-input"
                  label="confirm password"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  value={this.state.password}
                  onChange={this.handle_password2_change}
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
