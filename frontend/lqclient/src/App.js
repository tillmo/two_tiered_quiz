import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/HomePage/NavBar";
import Login from "./components/Authentication/Login";
import SignUp from "./components/Authentication/SignUp";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { translate } from 'react-i18next';

export class App extends Component {
  
  componentDidMount() {
    document.title = process.env.REACT_APP_TITLE;
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/app" component={NavBar} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default translate('common')(App);

