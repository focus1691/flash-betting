import React from 'react';
import { queryByTestId, render, screen } from '@testing-library/react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import socketIOClient from 'socket.io-client';
import SocketMock from 'socket.io-mock';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
//* Components
import App from '../../components/App';
//* Contexts
import SocketContext from '../../contexts/SocketContext';
//* Reducers
import reducers from '../../redux/reducers';
import combineMiddleWares from '../../redux/CombineMiddlewares';
import rootSaga from '../../redux/saga';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers(reducers);

const sagaMiddleware = createSagaMiddleware();
const middlewares = [...combineMiddleWares(), sagaMiddleware];
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));
sagaMiddleware.run(rootSaga);

const server = setupServer(
  rest.get('/greeting', (req, res, ctx) => {
    return res(ctx.json({ greeting: 'hello there' }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  jest.resetAllMocks();
});
afterAll(() => {
  server.close();
});

describe('App startup loading', () => {
  it('Sockets should be able to talk to each other without a server', async () => {
    const socket = new SocketMock();

    socket.on('message', function receiveMessage(message) {
      expect(message).toEqual('Hello World!');
    });
    socket.socketClient.emit('message', 'Hello World!');

    const wrapper = render(
      <Provider store={store}>
        <SocketContext.Provider value={socket}>
          <App />
        </SocketContext.Provider>
      </Provider>,
    );

    const spinner = screen.getByTestId('spinner');
    
    expect(spinner).toBeTruthy();
  });
});
