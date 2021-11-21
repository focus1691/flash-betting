import decode from 'jwt-decode';
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

export const fetchSecureData = async (endpoint, token) => {
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  return response;
}

export const isTokenExpired = (token) => {
  try {
    const decoded = decode(token);
    // Checking if token is expired.
    return decoded.exp < Date.now() / 1000;
  } catch (err) {
    return false;
  }
};
