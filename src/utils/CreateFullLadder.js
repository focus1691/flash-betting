export default () => {
  const Ladders = {};
  // 100 - 1000
  for (k = 1000; k >= 100; k -= 10) {
    let priceKey = (Math.round(k * 100) / 100).toFixed(2);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 50 - 100
  for (k = 100; k >= 50; k -= 5) {
    let priceKey = (Math.round(k * 100) / 100).toFixed(2);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 30 - 50
  for (k = 50; k >= 30; k -= 2) {
    let priceKey = (Math.round(k * 100) / 100).toFixed(2);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 20 - 30
  for (k = 30; k >= 20; k -= 1) {
    let priceKey = (Math.round(k * 100) / 100).toFixed(2);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 10 - 20
  for (k = 20; k >= 10; k -= 0.5) {
    let priceKey = (Math.round(k * 100) / 100).toFixed(2);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 6 - 10
  for (k = 10; k >= 6; k -= 0.2) {
    let priceKey = (Math.round(k * 100) / 100).toFixed(2);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 4 - 6
  for (k = 6; k >= 4; k -= 0.1) {
    let priceKey = (Math.round(k * 100) / 100).toFixed(2);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 3 - 4
  for (k = 4; k >= 3; k -= 0.05) {
    let priceKey = (Math.round(k * 100) / 100).toFixed(2);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 2 - 3
  for (var k = 3; k >= 2; k -= 0.02) {
    let priceKey = (Math.round(k * 100) / 100).toFixed(2);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 1 - 2
  for (k = 2; k >= 1; k -= 0.01) {
    let priceKey = (Math.round(k * 100) / 100).toFixed(2);
    Ladders[priceKey] = createDataPoints(priceKey);
  }
  return Ladders;
};

const createDataPoints = odds => {
  return {
    backProfit: null,
    backMatched: null,
    odds: odds,
    layMatched: null,
    layProfit: null
  };
};
