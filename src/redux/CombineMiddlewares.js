import thunk from 'redux-thunk';

export default () => {
  const middlewares = [thunk];

  if (process.env.REACT_APP_STAGE === 'development') {
    // eslint-disable-next-line global-require
    const { createLogger } = require(`redux-logger`);

    const logger = createLogger({
      // ...options
    });

    // middlewares.push(logger);
  }

  return middlewares;
};
