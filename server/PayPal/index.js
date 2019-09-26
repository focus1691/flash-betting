const braintree = require("braintree");

class PayPal {
    constructor() {
        this.gateway = braintree.connect({
            accessToken: process.env.PAYPAL_ACESS_TOKEN
          });
    }
    generateClientToken() {
        return new Promise((res, rej => {
            this.gateway.clientToken.generate({}, (err, response) => {
                if (err) rej();
                else res(response.clientToken);
              });
        }));
    }
}

module.exports = PayPal;