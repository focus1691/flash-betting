import React, { useEffect } from "react";
import { connect } from "react-redux";
import { updateLadderOrder } from "../../actions/market";
import { getMatchedBets } from "../../selectors/orderSelector";
import SuspendedWarning from "../GridView/SuspendedWarning";
import Ladder from './Ladder';

const Ladders = ({ladderOrder, sortedLadder, onChangeLadderOrder, marketOpen, marketStatus, excludedLadders, matchedBets, ladderUnmatched}) => {

  useEffect(() => {
    // initialize the order object
    const newOrderList = {};

    sortedLadder.map((key, index) => {
      newOrderList[index] = key;
    });

    onChangeLadderOrder(newOrderList);
  }, []);

  const newMatchedBets = {}; //selectionId: [{}]
  Object.values(matchedBets).map(bet => {
    if (newMatchedBets[bet.selectionId] === undefined) {
      newMatchedBets[bet.selectionId] = [bet];
    } else {
      newMatchedBets[bet.selectionId] = newMatchedBets[bet.selectionId].concat(bet);
    }
  });


  return (
    marketOpen && (marketStatus === "SUSPENDED" || marketStatus === "OPEN" || marketStatus === "RUNNING") ?                          
      <div className={"ladder-container"}
        onContextMenu = { (e) => { e.preventDefault(); return false } }
      >
        
        {marketOpen && sortedLadder
          ? Object.values(ladderOrder)
            .filter(value => excludedLadders.indexOf(value) === -1)
            .map((value, index) => (
              <Ladder 
                id = {value}
                key = {value}
                order = {index}
                selectionMatchedBets = {newMatchedBets[value]}
                ladderUnmatched = {ladderUnmatched}
                marketStatus = {marketStatus}
              />
            ))
        : null } 
        <SuspendedWarning marketStatus = {marketStatus} />
      </div>
    : null
  );
};

const mapStateToProps = state => {
  return {
    marketOpen: state.market.marketOpen,
    marketStatus: state.market.status,
    sortedLadder: state.market.sortedLadder,
    excludedLadders: state.market.excludedLadders,
    ladderOrder: state.market.ladderOrder,
    ladderUnmatched: state.settings.ladderUnmatched,
    matchedBets: getMatchedBets(state.order.bets),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeLadderOrder: order => dispatch(updateLadderOrder(order)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ladders);