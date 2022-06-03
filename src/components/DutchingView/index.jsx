import React from 'react';
import { connect } from 'react-redux';
import Slider from '@material-ui/core/Slider';
import { DeconstructLadder } from '../../utils/ladder/DeconstructLadder';
import { DeconstructRunner } from '../../utils/Market/DeconstructRunner';
import useStyles from '../../jss/components/DutchingView/Dutching';

const DutchingView = ({ marketOpen, marketStatus, ladder, sortedLadder, runners, eventType, dutching, dutchingStake }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderRunners = () => {
    return sortedLadder.map((key) => {
      const { atb, atl, ltp, tv, ltpStyle } = DeconstructLadder(ladder[key]);
      const { name, number, logo, order } = DeconstructRunner(runners[key], eventType.id);
      const { side, stakeLiability } = order;

      return (
        <div className={classes.runners} key={`dutching-${key}`}>
          <div>
            <p>
              {atb && atb[0] && atb[0][0] ? (
                <span>
                  {name} @ {atb[0][0]}
                </span>
              ) : null}
              {dutching.list[key] && dutching.list[key].stake ? <span>You should stake {dutching.list[key].stake}</span> : null}
            </p>
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
          <div className={classes.calculations}>
            <p>Total Stake {dutchingStake}</p>
            <p>Profit if any win {dutching.profitIfWin}</p>
            <p>Return if any win {dutching.returnIfWin}</p>
          </div>
          <Slider
            value={value}
            min={2}
            step={0.01}
            max={dutchingStake}
            onChange={handleChange}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
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
  dutchingStake: state.market.dutchingStake,
});

export default connect(mapStateToProps)(DutchingView);
