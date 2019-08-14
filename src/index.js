import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/Login";
import AppView from "./components/AppView";
import AuthRedirect from "./components/AuthRedirect";
import BetFairRedirect from "./components/RedirectPage";

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route path="/" exact component={Login}/>
      <Route path="/dashboard" exact component={AppView}/>
      <Route path="/authentication" exact component={AuthRedirect}/>
      <Route path="/validation" exact component={BetFairRedirect}/>
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);