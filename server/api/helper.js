const fetch = require('node-fetch');

class APIHelper {
  constructor(betfair) {
    this.betfair = betfair;
  }

  async getAccessToken(token) {
    try {
      const { result } = await new Promise((resolve, reject) => {
        this.betfair.getVendorClientId({}, (err, { error, result }) => {
          if (error) reject(error);
          resolve({ result });
        });
      }).catch((error) => ({ error }));
  
      if (result) {
        const response = await fetch(`https://flash-betting.herokuapp.com/access-token?vendorClientId=${result}`, {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        if (response.ok) {
          const data = await response.json();
          const { accessToken } = data;
          return accessToken;
        }
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  static async login(params) {
    try {
      const response = await fetch('https://flash-betting.herokuapp.com/login', {
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
}

module.exports = APIHelper;
