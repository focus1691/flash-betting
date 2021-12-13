import decode from 'jwt-decode';
import handleAuthError from '../utils/Errors/handleAuthError';
import extractErrorCode from '../utils/Errors/ExtractErrorCode';

export default async (endpoint) => {
  try {
    const { result, error } = await fetch(endpoint).then((res) => res.json());

    if (error) {
      const errorCode = extractErrorCode(error);
      handleAuthError(errorCode);
      return {
        error,
      }
    }
    return result;
  } catch (error) {
    console.log(`Error: fetching data ${error}`);
    return null;
  }
};

export const fetchSecureData = async (endpoint, token) => {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    return response;
  } catch (error) {
    console.log(`Error: fetching secure data ${error}`);
    return null;
  }
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
