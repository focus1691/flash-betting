import { authErrors } from './ErrorTypes';

export default (async (errorCode) => {
  if (authErrors.includes(errorCode)) {
    window.location.href = `${window.location.origin}/?error=${errorCode}`;
  }
});
