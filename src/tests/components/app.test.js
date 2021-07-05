import React from 'react';
import { render } from '@testing-library/react';
import socketIOClient from 'socket.io-client';
import SocketMock from 'socket.io-mock';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
//* Contexts
import SocketContext from '../../contexts/SocketContext';
//* Reducers
import reducers from '../../redux/reducers';

const server = setupServer(
  rest.get('/greeting', (req, res, ctx) => {
    return res(ctx.json({ greeting: 'hello there' }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App startup loading', () => {
  it('Sockets should be able to talk to each other without a server', async () => {
    const socket = new SocketMock();

    socket.on('message', function receiveMessage(message) {
      expect(message).toEqual('Hello World!');
    });
    socket.socketClient.emit('message', 'Hello World!');
  });
});
