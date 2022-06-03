import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import openSocket from 'socket.io-client';
import combineMiddleWares from './redux/CombineMiddlewares';
import rootSaga from './redux/sagas';
//* Reducers
import reducers from './redux/reducers';
//* Components
import Login from './components/Login';
import Logout from './components/Logout';
import App from './components/App';
import Authentication from './components/Authentication';
import OAuthRedirect from './components/OAuthRedirect';
//* Contexts
import SocketContext from './contexts/SocketContext';
//* Utility
import removeLogs from './utils/RemoveLogs';

Number.prototype.round = function round(places) {
	return +(Math.round(this + "e+" + places) + "e-" + places);
};

removeLogs();

const socket = openSocket(`http://localhost:${process.env.NODE_ENV === 'production' ? 9090 : 3001}`, {
  'force new connection': true,
  'reconnectionAttempts': 'Infinity',
  'timeout': 10000,
  transports: ['websocket'],
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers(reducers);

const sagaMiddleware = createSagaMiddleware();
const middlewares = [...combineMiddleWares(), sagaMiddleware];
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/dashboard" component={App} />
          <Route path="/authentication" exact component={Authentication} />
          <Route path="/validation" exact component={OAuthRedirect} />
          <Route path="/logout" exact component={Logout} />
        </Switch>
      </BrowserRouter>
    </SocketContext.Provider>
  </Provider>,
  document.getElementById('root'),
);
