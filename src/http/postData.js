import handleAuthError from '../utils/Errors/handleAuthError'

export default async (endpoint, data) => {
  const { result, error } = await fetch(endpoint, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => res.json())

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
