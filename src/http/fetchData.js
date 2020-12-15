import handleAuthError from '../utils/Errors/handleAuthError'

export default async (endpoint) => {

  const { result, error } = await fetch(endpoint).then((res) => res.json());

  if (error) {
    let errorCode = '';
    if (error.data) {
      if (error.data.AccountAPINGException) {
        errorCode = error.data.AccountAPINGException.errorCode;
      }
      else if (error.data.APINGException) {
        errorCode = error.data.APINGException.errorCode;
      }
    }
    else {
      errorCode = error;
    }
    handleAuthError(errorCode);
    return {
      error,
    }
  }
  return result;
};
