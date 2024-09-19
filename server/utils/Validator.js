function isAuthURL(url) {
  return /(?:login|logout|get-subscription-status|get-vendor-client-id|keep-alive|vendor-id)/.test(url);
}

module.exports = {
  isAuthURL,
};
