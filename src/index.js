import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import sportReducer from "./reducers/sportReducer";
import accountReducer from "./reducers/accountReducer";
import settingsReducer from "./reducers/settingsReducer";
import stopLossReducer from "./reducers/stopLossReducer";
import stopEntryReducer from "./reducers/stopEntryReducer";
import backReducer from "./reducers/backReducer";
import layReducer from "./reducers/layReducer";
import fillOrKillReducer from "./reducers/fillOrKillReducer";
import tickOffsetReducer from "./reducers/tickOffsetReducer";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import App from "./components/App";
import AuthRedirect from "./components/AuthRedirect";
import OAuthRedirect from "./components/OAuthRedirect";
import openSocket from "socket.io-client";
import SocketContext from './SocketContext'

const socket = openSocket("http://localhost:8000");

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  account: accountReducer,
  sports: sportReducer,
  settings: settingsReducer,
  stopLoss: stopLossReducer,
  tickOffset: tickOffsetReducer,
  back: backReducer,
  lay: layReducer,
  fillOrKill: fillOrKillReducer,
  stopEntry: stopEntryReducer
});

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

ReactDOM.render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            exact
            render={() =>
              !!localStorage.getItem("sessionKey") &&
              ! localStorage.getItem("accessToken") ? (
                <Redirect to="/authentication" />
              ) : 
              !!localStorage.getItem("sessionKey") &&
              !!localStorage.getItem("accessToken") ? (
                <Redirect to="/dashboard" />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/dashboard"
            exact
            render={() =>
              !localStorage.getItem("sessionKey") ||
              !localStorage.getItem("accessToken") ? (
                <Redirect to="/" />
              ) : (
                <App />
              )
            }
          />
          <Route path="/authentication" exact component={AuthRedirect} />
          <Route path="/validation" exact component={OAuthRedirect} />
          <Route path="/logout" exact component={Logout} />
        </Switch>
      </BrowserRouter>
    </SocketContext.Provider>
  </Provider>,
  document.getElementById("root")
);