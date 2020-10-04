

async function useBetFair (req, res, next) {
  req.betfair = betfair;
  next();
}