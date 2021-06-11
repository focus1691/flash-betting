import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

export default () => {
  const middlewares = [thunk, sagaMiddleware];

  if (process.env.REACT_APP_STAGE === 'development') {
    // eslint-disable-next-line global-require
    const { createLogger } = require(`redux-logger`);

    const logger = createLogger({
      // ...options
    });

    middlewares.push(logger);
  }

  return middlewares;
};
