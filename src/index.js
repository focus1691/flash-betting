import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import sportReducer from "./reducers/sportReducer";
import accountReducer from "./reducers/accountReducer";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/Login";
import App from "./components/App";
import AuthRedirect from "./components/AuthRedirect";
import OAuthRedirect from "./components/OAuthRedirect";
import openSocket from "socket.io-client";
import SocketContext from './SocketContext'

const socket = openSocket("http://localhost:8000");

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  account: accountReducer,
  sports: sportReducer
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
              !!localStorage.getItem("sessionKey") ? (
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
              !localStorage.getItem("sessionKey") &&
              !localStorage.getItem("accessToken") ? (
                <Redirect to="/" />
              ) : (
                <App />
              )
            }
          />
          <Route path="/authentication" exact component={AuthRedirect} />
          <Route path="/validation" exact component={OAuthRedirect} />
        </Switch>
      </BrowserRouter>
    </SocketContext.Provider>
  </Provider>,
  document.getElementById("root")
);