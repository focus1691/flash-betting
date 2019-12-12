import React, { memo } from "react";
import { connect } from "react-redux";
import { iconForEvent } from "../../utils/Market/EventIcons";
import { calcBackBet, calcHedgedPL2 } from "../../utils/TradingStategy/HedingCalculator";
import { getTrainerAndJockey } from "../../utils/Market/GetTrainerAndJockey";
import { setRunner } from "../../actions/market";
import { getRunner, getSportId, getLTP } from "../../selectors/marketSelector";
import { getMatchedBets, getUnmatchedBets } from "../../selectors/orderSelector";
import { getPLForRunner } from "../../utils/Bets/GetProfitAndLoss";
import CalculateLadderHedge from "../../utils/ladder/CalculateLadderHedge";

const LadderHeader = ({ market, selectionId, sportId, runner, onSelectRunner, setLadderDown, unmatchedBets, matchedBets, oddsHovered, ltp }) => {

  const PL = matchedBets !== undefined ? getPLForRunner(market.marketId, parseInt(selectionId), { matched: matchedBets }).toFixed(2) : 0;
  const ordersOnMarket = Object.keys(unmatchedBets).length + Object.keys(matchedBets).length > 0;

  const oddsHoveredCalc = ((oddsHovered.side == "BACK" && oddsHovered.selectionId === selectionId) || (oddsHovered.side == "LAY" && oddsHovered.selectionId !== selectionId) ? 1 : -1) * parseFloat(calcBackBet(oddsHovered.odds, 2) +
    ((oddsHovered.side == "BACK" && oddsHovered.selectionId === selectionId) || (oddsHovered.side == "LAY" && oddsHovered.selectionId !== selectionId) ? 1 : -1) * parseFloat(PL)).toFixed(2);

  const handleMouseDown = () => e => {
    setLadderDown(true);
  };

  const handleNoImageError = () => e => {
    e.target.onerror = null;
    e.target.src = iconForEvent(parseInt(sportId));
  };

  const selectionMatchedBets = [];
  Object.values(matchedBets).map(bet => {
    if (bet.selectionId == selectionId) {
      selectionMatchedBets.push(bet)
    }
  });

  // calculate ladder ltp hedge
  const profitArray = selectionMatchedBets.map(bet => (bet.side === "LAY" ? -1 : 1) * calcHedgedPL2(parseFloat(bet.size), parseFloat(bet.price), parseFloat(ltp)));
  const ladderLTPHedge = (-1 * profitArray.reduce((a, b) => a - b, 0)).toFixed(2);
  const newStake = selectionMatchedBets !== undefined ? selectionMatchedBets.reduce((a, b) => a + (b.side === "LAY" ? -parseFloat(b.size) : parseFloat(b.size)), 0) + parseFloat(ladderLTPHedge) : 0;
  
  
  return (
    <div className={"ladder-header"}>
      <div>
        <h2 className="contender-name"
          onMouseDown={handleMouseDown()}
        >
          {
            <img
              className={"contender-image"}
              src={
                runner.metadata.COLOURS_FILENAME && parseInt(sportId) === 7
                  ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${runner.metadata.COLOURS_FILENAME}`
                  : iconForEvent(sportId)
              }
              alt={"Colours"}
              onClick={onSelectRunner}
              onError={handleNoImageError()}
            />
          }
          {`${
            runner.metadata.CLOTH_NUMBER ? runner.metadata.CLOTH_NUMBER + ". " : ""
            }${runner.runnerName}`}
        </h2>
        <div className="contender-odds-container">
          <span className="contender-odds"
            style={{
              visibility: ordersOnMarket ? 'visible' : 'hidden',
              color: PL > 0 ? 'rgb(106, 177, 79)' : 'red'
            }}
          >{"£" + Math.abs(PL)}</span>
          <div className={"contender-details"}>
            <span>{getTrainerAndJockey(runner.metadata)}</span>
          </div>
          <span className="contender-odds"
            style={{
              visibility: oddsHovered.odds > 0 && ordersOnMarket ? 'visible' : 'hidden',
              color: oddsHoveredCalc > 0 ? 'rgb(106, 177, 79)' : 'red'
            }}>
            {"£" + Math.abs(oddsHoveredCalc)}
          </span>
        </div>
      </div>
      <div>
        <span style={{ visibility: ladderLTPHedge === 0 ? 'hidden' : 'visible', color: parseFloat(ladderLTPHedge).toFixed(2) > 0 ? 'rgb(106, 177, 79)' : 'red' }}>
          {"£" + parseFloat(Math.abs(parseFloat(ladderLTPHedge))).toFixed(2)}
        </span>
        <span style={{ visibility: newStake === 0 ? 'hidden' : 'visible', color: parseFloat(newStake).toFixed(2) > 0 ? 'rgb(106, 177, 79)' : 'red' }}>
          {"£" + parseFloat(Math.abs(parseFloat(newStake))).toFixed(2)}
        </span>
      </div>
    </div>
  )
};

const mapStateToProps = (state, {selectionId}) => {
  return {
    market: state.market.currentMarket,
    sportId: getSportId(state.market.currentMarket),
    runner: getRunner(state.market.runners, {selectionId}),
    unmatchedBets: getUnmatchedBets(state.order.bets),
    matchedBets: getMatchedBets(state.order.bets),
    ltp: getLTP(state.market.ladder, {selectionId}),
    oddsHovered: state.market.oddsHovered
  };
}; 

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => e => dispatch(setRunner(runner)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(LadderHeader));