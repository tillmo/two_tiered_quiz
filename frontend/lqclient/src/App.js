import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/HomePage/NavBar";
import QuizDescription from "./components/QuizPage/QuizDescription";
import QuizQuestion from "./components/QuizPage/QuizQuestion";
import Login from "./components/Authentication/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";

export class App extends Component {

  state = {
    isUserLoggedIn: false,
  };

  setUser = (isLoggedIn) => {
    this.setState({
      isUserLoggedIn: true
    });
  };

  render() {
    return (
      <Router>
        <div className="App">
          {!this.state.isUserLoggedIn ? (
            <Login setUser = {this.setUser}/>
          ) : (
            <NavBar>
              <Switch>
                <Route path="/" exact component={QuizDescription} />
                <Route path="/quiz/:id" component={QuizQuestion} />
              </Switch>
            </NavBar>
          )}
        </div>
      </Router>
    );
  }
}

export default App;
