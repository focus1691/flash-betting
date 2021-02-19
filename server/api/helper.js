const fetch = require('node-fetch');

class APIHelper {
  constructor(betfair) {
    this.betfair = betfair;
  }

  async getAccessToken() {
    const { result } = await new Promise((resolve, reject) => {
      this.betfair.getVendorClientId({}, (err, { error, result }) => {
        if (error) reject(error);
        resolve({ result });
      });
    }).catch((error) => ({ error }));

    if (result) {
      const response = await fetch(`http://localhost:3000/access-token?vendorClientId=${result}`);
      const data = await response.json();
      const { accessToken } = data;
      return accessToken;
    }
    return null;
  }
}

module.exports = APIHelper;
