import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import thunk from 'redux-thunk';
import openSocket from 'socket.io-client';
import reducers from './utils/Reducers';
import Login from './components/Login';
import Logout from './components/Logout';
import App from './components/App';
import GetClosedMarketStats from './components/GetClosedMarketStats';
import Authentication from './components/Authentication';
import OAuthRedirect from './components/OAuthRedirect';
import SocketContext from './SocketContext';

const socket = openSocket('http://localhost:3001');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers(reducers);

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/dashboard" component={App} />
          <Route path="/getClosedMarketStats" component={GetClosedMarketStats} />
          <Route path="/authentication" exact component={Authentication} />
          <Route path="/validation" exact component={OAuthRedirect} />
          <Route path="/logout" exact component={Logout} />
        </Switch>
      </BrowserRouter>
    </SocketContext.Provider>
  </Provider>,
  document.getElementById('root'),
);
