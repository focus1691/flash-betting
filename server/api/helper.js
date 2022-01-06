const fetch = require('node-fetch');
const { FLASH_BETTING_URL } = require('../constants');

class APIHelper {
  constructor(betfair) {
    this.betfair = betfair;
  }

  static async getAccessToken(token) {
    try {
      const response = await fetch(`${FLASH_BETTING_URL}/refresh-access-token`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json();
        const { result: { accessToken } } = data;
        return accessToken;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }
 
  static async login(params) {
    try {
      const response = await fetch(`${FLASH_BETTING_URL}/login-app`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(params),
      });
  
      if (response.ok) {
        const { token } = await response.json();
        return token;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  static async isUserRegistered(user) {
    try {
      const response = await fetch(`${FLASH_BETTING_URL}/user-status?user=${user}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
  
      if (response.ok) {
        const { registered } = await response.json();
        return registered;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  }
}

module.exports = APIHelper;
