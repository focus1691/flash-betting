function isAuthURL(url) {
  return /(?:login|logout|get-subscription-status|get-vendor-client-id|keep-alive|registration-status|authenticate-user|vendor-id|registration-status)/.test(url);
}

module.exports = {
  isAuthURL,
};
