import React from "react";
import ReactDOM from "react-dom";
// import { createStore } from "redux";
// import { Provider } from "react-redux";
// import sportReducer from "./reducers/sportReducer";
import { StoreProvider } from "./Store";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/Login";
import AppView from "./components/App";
import AuthRedirect from "./components/AuthRedirect";
import BetFairRedirect from "./components/RedirectPage";

ReactDOM.render(
  <BrowserRouter >
    {/* <Provider store={createStore(sportReducer)}> */}
    <StoreProvider>
      <Route path="/" exact component={Login} />
      <Route path="/dashboard" exact component={App} />
      <Route path="/authentication" exact component={AuthRedirect} />
      <Route path="/validation" exact component={BetFairRedirect} />
      </StoreProvider>
    {/* </Provider> */}
  </BrowserRouter>,
  document.getElementById("root")
);