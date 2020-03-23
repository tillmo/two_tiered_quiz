import React from "react";
import "./App.css";
import NavBar from "./components/HomePage/NavBar";
import QuizDescription from "./components/QuizPage/QuizDescription";
import QuizQuestion from "./components/QuizPage/QuizQuestion";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar>
          <Switch>
            <Route path="/" exact component={QuizDescription} />
            <Route path="/quiz/:id" component={QuizQuestion} />
          </Switch>
        </NavBar>
      </div>
    </Router>
  );
}

export default App;
