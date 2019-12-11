import React, { memo } from "react";
import { connect } from "react-redux";
import { iconForEvent } from "../../utils/Market/EventIcons";
import { calcBackBet } from "../../utils/TradingStategy/HedingCalculator";
import { getTrainerAndJockey } from "../../utils/Market/GetTrainerAndJockey";
import { setRunner } from "../../actions/market";
import { getRunner, getSportId } from "../../selectors/marketSelector";
import { getMatchedBets, getUnmatchedBets } from "../../selectors/orderSelector";
import { getPLForRunner } from "../../utils/Bets/GetProfitAndLoss";

const LadderHeader = ({ market, selectionId, sportId, runner, onSelectRunner, setLadderDown, unmatchedBets, matchedBets, ladderLTPHedge, newStake, oddsHovered }) => {

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
  };
}; 

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => e => dispatch(setRunner(runner)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(LadderHeader));