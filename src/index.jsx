import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import thunk from 'redux-thunk';
import openSocket from 'socket.io-client';
//* Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
//* Reducers
import reducers from './reducers';
//* Components
import Login from './components/Login';
import Logout from './components/Logout';
import App from './components/App';
import ClosedMarketView from './components/ClosedMarketView';
import Authentication from './components/Authentication';
import OAuthRedirect from './components/OAuthRedirect';
//* Contexts
import SocketContext from './contexts/SocketContext';

//* Stripe
const PUBLIC_KEY = 'pk_test_51Ii5FXKbtGV5AqwZPcERWcj2YcAnqfvjoozVGmuqqIGr4pUvEXw9yiUF0eaE94PlDj4Zb8IXSSyrlqyJdkkszMda00WxqoPPr1';
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const socket = openSocket('http://localhost:3001');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers(reducers);

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
  <Elements stripe={stripeTestPromise}>
    <Provider store={store}>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/dashboard" component={App} />
            <Route path="/getClosedMarketStats" component={ClosedMarketView} />
            <Route path="/authentication" exact component={Authentication} />
            <Route path="/validation" exact component={OAuthRedirect} />
            <Route path="/logout" exact component={Logout} />
          </Switch>
        </BrowserRouter>
      </SocketContext.Provider>
    </Provider>
  </Elements>,
  document.getElementById('root'),
);
