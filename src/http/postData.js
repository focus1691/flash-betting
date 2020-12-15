import { authErrors } from '../utils/Errors/ErrorTypes';

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
    if (authErrors.includes(errorCode)) {
      window.location.href = `${window.location.origin}/?error=${errorCode}`;
    }
    return {
      error,
    }
  }
  return result;
};
