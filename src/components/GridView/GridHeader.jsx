import React from 'react';
import { connect } from 'react-redux';
import uuid from 'react-uuid';
import moment from 'moment';
import crypto from 'crypto';
import clsx from 'clsx';
//* @material-ui core
import Button from '@material-ui/core/Button';
//* Actions
import { placeOrder } from '../../redux/actions/bet';
import { setStakeInOneClick } from '../../redux/actions/settings';
//* Utils
import { sumMatchedBets } from '../../utils/Bets/BettingCalculations';
import { getHedgedBetsToMake } from '../../utils/TradingStategy/HedingCalculator';
import { formatTotalMatched } from '../../utils/NumberFormat';
import { renderRaceStatus } from './RaceStatus';
//* JSS
import useStyles from '../../jss/components/GridView/GridHeader';

const GridHeader = ({
  marketId,
  ladder,
  marketOpen,
  marketStartTime,
  event,
  inPlay,
  marketStatus,
  country,
  oneClickRef,
  oneClickOn,
  toggleOneClick,
  placeOrder,
  oneClickButtontype,
  oneClickButtonSelection,
  setStakeInOneClick,
  stakeBtns,
  layBtns,
  bets,
  ltpList,
  marketCashout,
}) => {
  const classes = useStyles();

  const executeMarketCashout = () => {
    const hedgedBets = getHedgedBetsToMake(marketId, bets, ltpList);

    if (hedgedBets.length > 0) {
      for (let i = 0; i < hedgedBets.length; i += 1) {
        const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);

        placeOrder({
          marketId,
          side: hedgedBets[i].side,
          size: hedgedBets[i].stake,
          price: hedgedBets[i].buyPrice,
          selectionId: hedgedBets[i].selectionId,
          customerStrategyRef: referenceStrategyId,
        });
      }
    }
  };

  return (
    <>
      <tr className={classes.gridHeader}>
        <th colSpan="11">
          <button type="button" className={classes.oneClickBtn} ref={oneClickRef} onClick={toggleOneClick()}>
            {`Turn One click ${oneClickOn ? 'off' : 'on'}`}
          </button>
          <h1>{marketOpen ? `${moment(marketStartTime).calendar()} ${event.name ? event.name : event.venue ? event.venue : ''}` : 'No Event Selected'}</h1>
          {oneClickOn ? (
            <>
              <div className={clsx(classes.oneClickButtons, classes.oneClickStake)}>
                <Button>STAKE</Button>
                {stakeBtns.map((stake, index) => (
                  <button
                    key={`one-click-stake-button-${uuid()}`}
                    type="button"
                    className={clsx({
                      [classes.oneClickStakeSelected]: oneClickButtontype === 'stake' && oneClickButtonSelection === index,
                    })}
                    onClick={() => setStakeInOneClick({ buttonType: 'stake', buttonSelected: index })}
                  >
                    {stake}
                  </button>
                ))}
              </div>
              <div className={clsx(classes.oneClickButtons, classes.oneClickLiability)}>
                <Button>LIABILITY</Button>
                {layBtns.map((stake, index) => (
                  <button
                    key={`one-click-liability-button-${uuid()}`}
                    type="button"
                    className={clsx({
                      [classes.oneClickLiabilitySelected]: oneClickButtontype === 'lay' && oneClickButtonSelection === index,
                    })}
                    onClick={() => setStakeInOneClick({ buttonType: 'lay', buttonSelected: index })}
                  >
                    {stake}
                  </button>
                ))}
              </div>
            </>
          ) : null}
          {renderRaceStatus(marketOpen, marketStatus, inPlay, classes.inPlay)}
          <span className={classes.matchedBets}>{marketOpen ? `Matched: ${formatTotalMatched(country.localeCode, country.currencyCode, sumMatchedBets(ladder))}` : null}</span>
        </th>
      </tr>
      <tr className={classes.gridSubheader}>
        {/* The Cash out figure simply adds all current profit and losses together
            If you click it, then it should place N bets (or how ever many you need)
            to close those positions/
        */}
        <th className={classes.marketCashout}>
          <span>Market Cashout</span>
          <span style={{ color: marketCashout < 0 ? 'red' : marketCashout > 0 ? '#01CC41' : '#D3D3D3' }} onClick={executeMarketCashout}>
            {marketCashout}
          </span>
        </th>
        <th colSpan="2" />
        <th />
        <th />
        <th>
          <span className={classes.headerText}>BACK</span>
        </th>
        <th>
          <span className={classes.headerText}>LAY</span>
        </th>
        <th />
        <th />
        <th />
        <th />
      </tr>
    </>
  );
};

const mapStateToProps = (state) => ({
  inPlay: state.market.inPlay,
  marketId: state.market.marketId,
  marketStartTime: state.market.marketStartTime,
  marketStatus: state.market.status,
  event: state.market.event,
  oneClickButtontype: state.settings.oneClickStake.buttonType,
  oneClickButtonSelection: state.settings.oneClickStake.buttonSelected,
});

const mapDispatchToProps = {
  placeOrder,
  setStakeInOneClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(GridHeader);
