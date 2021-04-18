import handleAuthError from '../utils/Errors/handleAuthError';
import extractErrorCode from '../utils/Errors/ExtractErrorCode';

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
    const errorCode = extractErrorCode(error);
    handleAuthError(errorCode);
    return {
      error,
    }
  }
  return result;
};
