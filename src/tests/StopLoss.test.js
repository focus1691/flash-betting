
import { findStopPosition } from "../utils/TradingStategy/StopLoss";

test('mcm should go through all strategies', async () => {
    expect(findStopPosition("150", 5, "BACK")).toBe("200.00");
});