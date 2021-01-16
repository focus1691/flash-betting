import React, { memo, useMemo, useCallback } from 'react';
import {
  twoDecimalPlaces, getStrategyAbbreviation, getStrategySuffix, colorForOrder,
} from '../../../../utils/Bets/BettingCalculations';
import useStyles from '../../../../jss/components/LadderView/OrderRow/unmatchedBetStyle';

const UnmatchedBet = memo(({ bet, cancelBet }) => {
  const classes = useStyles();
  const strategyAbbreviation = useMemo(() => getStrategyAbbreviation(bet.trailing, bet.hedged), [bet.hedged, bet.trailing]);
  const strategySuffix = useMemo(() => getStrategySuffix(bet.strategy, bet.stopEntryCondition, bet.targetLTP, strategyAbbreviation), []);

  const handleClick = useCallback(() => {
    cancelBet(bet);
  }, [bet, cancelBet]);

  return (
    <tr>
      <td style={colorForOrder(bet.side, bet.strategy)}>
        <img
          className={classes.cancelButton}
          src={`${window.location.origin}/icons/X_Button.svg`}
          alt="X"
          style={{ cursor: 'pointer' }}
          onClick={handleClick}
        />
        {`${bet.sizeRemaining || bet.size} @ ${twoDecimalPlaces(bet.price)} ${strategySuffix}`}
      </td>
    </tr>
  );
});

export { UnmatchedBet };
