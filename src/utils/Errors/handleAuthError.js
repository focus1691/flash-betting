import errorList from './AuthErrors';

export default (async (errorCode) => {
  if (errorList[errorCode]) {
    window.location.href = `${window.location.origin}/?error=${errorCode}`;
  }
});
