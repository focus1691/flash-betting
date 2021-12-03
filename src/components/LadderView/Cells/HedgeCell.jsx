import _ from 'lodash';
import crypto from 'crypto';
import React, { memo, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
//* Actions
import { placeOrder } from '../../../redux/actions/bet';
//* HTTP
import { cancelMarketBets } from '../../../http/placeBets';
//* Selectors
import { getUnmatchedBetsOnRow } from '../../../selectors/orderSelector';
//* Utils
import { calcHedgeProfit } from '../../../utils/Bets/HedgeProfit';
import GetUnmatchedStake from '../../../utils/Bets/GetUnmatchedStake';
//* JSS
import useStyles from '../../../jss/components/LadderView/hedgeCellStyle';

const LadderHedgeCell = ({ marketId, selectionId, price, unmatchedBets, side, hedgingAvailable, PLHedgeNumber, placeOrder }) => {
  const classes = useStyles();
  const hedgePL = useMemo(() => calcHedgeProfit(PLHedgeNumber, side), [PLHedgeNumber, side]);
  const unmatchedStake = useMemo(() => GetUnmatchedStake(unmatchedBets), [unmatchedBets]);
  const text = useMemo(() => (unmatchedStake > 0 ? unmatchedStake : hedgingAvailable ? hedgePL : null), [unmatchedStake, hedgingAvailable, hedgePL]);

  const handleClick = useCallback(() => {
    console.log(`unmatched Bets: ${Boolean(unmatchedBets) && unmatchedBets.length} PL hedge ${PLHedgeNumber && PLHedgeNumber.size}`);
    if (unmatchedBets && unmatchedBets.length > 0) {
      cancelMarketBets(marketId, unmatchedBets);
    }
    else if (PLHedgeNumber && PLHedgeNumber.size > 0) {
      const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
      console.log(`hedging: ${marketId} ${side} ${PLHedgeNumber.size} ${price} ${selectionId} ${customerStrategyRef}`);
      placeOrder({
        marketId,
        side,
        size: PLHedgeNumber.size,
        price,
        selectionId,
        customerStrategyRef,
      });
    }
  }, [marketId, selectionId, unmatchedBets, side, price, PLHedgeNumber]);

  return (
    <div
      role="button"
      tabIndex="0"
      className={clsx('td', {
        [classes.profit]: hedgePL >= 0,
        [classes.loss]: hedgePL < 0,
        [classes.breakEven]: !_.isEmpty(unmatchedBets),
      })}
      onClick={handleClick}
    >
      {text}
    </div>
  );
};

const mapStateToProps = (state, { selectionId, price, side }) => ({
  marketId: state.market.marketId,
  unmatchedBets: getUnmatchedBetsOnRow(state.order.bets, { selectionId, price, side }),
});

const mapDispatchToProps = { placeOrder };

export default connect(mapStateToProps, mapDispatchToProps)(memo(LadderHedgeCell));
