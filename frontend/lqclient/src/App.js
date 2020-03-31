import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/HomePage/NavBar";
import Login from "./components/Authentication/Login";
import SignUp from "./components/Authentication/SignUp";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export class App extends Component {
  
  componentDidMount() {
    document.title = 'Logik Quiz';
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

export default App;
