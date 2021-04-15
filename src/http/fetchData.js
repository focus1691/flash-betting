import handleAuthError from '../utils/Errors/handleAuthError';
import extractErrorCode from '../utils/Errors/ExtractErrorCode';

export default async (endpoint) => {

  const { result, error } = await fetch(endpoint).then((res) => res.json());

  if (error) {
    const errorCode = extractErrorCode(error);
    handleAuthError(errorCode);
    return {
      error,
    }
  }
  return result;
};
