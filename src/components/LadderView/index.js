import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateLadderOrder } from "../../actions/market";
import Ladder from './Ladder'
import { getMatchedBets } from "../../selectors/orderSelector";

const Ladders = ({ladderOrder, sortedLadder, onChangeLadderOrder, marketOpen, marketStatus, excludedLadders, matchedBets, ladderUnmatched}) => {

  const [oddsHovered, setOddsHovered] = useState({selectionId: 0, odds: 0, side: "BACK"}) 

  useEffect(() => {
    // initialize the order object
    const newOrderList = {};

    sortedLadder.map((key, index) => {
      newOrderList[index] = key;
    })

    onChangeLadderOrder(newOrderList);
  }, [sortedLadder])

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
                setOddsHovered = {setOddsHovered}
                oddsHovered = {oddsHovered}
                ladderUnmatched = {ladderUnmatched}
              />
            ))
        : null } 
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
