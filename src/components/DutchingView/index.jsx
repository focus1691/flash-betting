import React from 'react';
import { connect } from 'react-redux';
import { DeconstructLadder } from '../../utils/ladder/DeconstructLadder';
import { DeconstructRunner } from '../../utils/Market/DeconstructRunner';
import useStyles from '../../jss/components/DutchingView/Dutching';

const DutchingView = ({ marketOpen, marketStatus, ladder, sortedLadder, runners, eventType, dutching }) => {
  const classes = useStyles();

  console.log(dutching);

  const renderRunners = () => {
    return sortedLadder.map((key) => {
      const { atb, atl, ltp, tv, ltpStyle } = DeconstructLadder(ladder[key]);
      const { name, number, logo, order } = DeconstructRunner(runners[key], eventType.id);
      const { side, stakeLiability } = order;
      console.log(dutching[key]);

      return (
        <div className={classes.runners} key={`dutching-${key}`}>
          <div>
            <p>
              {atb && atb[0] && atb[0][0] ? <span>{name} @ {atb[0][0]}</span> : null}
              {name} @ {atb[0][0]}
            </p>
            {dutching[key] && dutching[key].stake ? <p>You should stake {dutching[key].stake}</p> : null}
          </div>
        </div>
      );
    });
  };

  const isMarketReady = () => {
    return marketOpen && (marketStatus === 'OPEN' || marketStatus === 'RUNNING' || marketStatus === 'SUSPENDED');
  };

  return (
    <div className={classes.container}>
      {isMarketReady() ? (
        <>
          {renderRunners()}
          <div>
            <p>Profit if any win</p>
            <p>Return if any win</p>
          </div>
        </>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketStatus: state.market.status,
  ladder: state.market.ladder,
  sortedLadder: state.market.sortedLadder,
  runners: state.market.runners,
  eventType: state.market.eventType,
  dutching: state.market.dutching,
});

export default connect(mapStateToProps)(DutchingView);
