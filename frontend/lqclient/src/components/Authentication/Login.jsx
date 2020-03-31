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
import { BrowserRouter as Router, Switch, Route,Redirect } from "react-router-dom";



export class Login extends Component {
  state = {
    username: "",
    password: "",
    open: false,
    isToken: false,
    isUserLoggedIn : false,
  };

  componentDidMount() {
    var loggedInTime = localStorage.getItem("loggedinTime");
    
    var timeDifference = (Date.now() - loggedInTime);
    var diffMins = Math.round(((timeDifference % 86400000) % 3600000) / 60000); 
    if (diffMins>60) {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedinTime");
    } 
    var x = localStorage.getItem("token");
    if(x) {
      this.setState({isUserLoggedIn:true});
    }
  }

  handle_username_change = e => {
    const value = e.target.value;
    this.setState({
      username: value
    });
  };

  handle_password_change = e => {
    const value = e.target.value;
    this.setState({
      password: value
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = (event, reason) => {
    this.setState({
      open: false
    });
  };

  handleLogin = e => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/rest-auth/login/", {
        username: this.state.username,
        password: this.state.password
      })
      .then(res => {
        localStorage.setItem("token", res.data.key);
        localStorage.setItem("loggedinTime", Date.now());
        this.setState({
          isToken: true,
        });
        
      })
      .catch(err => {console.log("invalid credentials")});
  };

  render() {
    if (this.state.isUserLoggedIn) {
      return <Redirect to="/app/"/>;
    }
    if (this.state.isToken) {
      return <Redirect to="/app/"/>;
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
                  Login
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
                  style={{ width: "100%" }}
                  id="outlined-basic"
                  label="username"
                  variant="outlined"
                  value={this.state.username}
                  onChange={this.handle_username_change}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  style={{ width: "100%" }}
                  id="standard-password-input"
                  label="password"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  value={this.state.password}
                  onChange={this.handle_password_change}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleLogin}
                >
                  Login
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={6} style={{ paddingTop: "15px" }}>
                <Link href="/signup" variant="body2" style={{ marginLeft: "60px" }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </div>
    );
  }
}

export default Login;
