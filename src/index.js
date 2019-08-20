import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import sportReducer from "./reducers/sportReducer";
import authReducer from "./reducers/authReducer";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk'
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/Login";
import App from "./components/App";
import AuthRedirect from "./components/AuthRedirect";
import BetFairRedirect from "./components/RedirectPage";
import openSocket from "socket.io-client";
import SocketContext from './SocketContext'

const socket = openSocket("http://localhost:8000");

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  sports: sportReducer
});

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

ReactDOM.render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <BrowserRouter >
        <Route path="/" exact component={Login} />
        <Route path="/dashboard" exact component={App} />
        <Route path="/authentication" exact component={AuthRedirect} />
        <Route path="/validation" exact component={BetFairRedirect} />
      </BrowserRouter>
    </SocketContext.Provider>
  </Provider>,
  document.getElementById("root")
);