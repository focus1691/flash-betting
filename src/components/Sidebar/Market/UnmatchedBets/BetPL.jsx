import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
//* Utils
import { getStrategyAbbreviation, getStrategySuffixForPL } from '../../../../utils/Bets/BettingCalculations';
//* JSS
import useStyles from '../../../../jss/components/Sidebar/market/profitLossStyle';

export default ({ bet, marketStartTime }) => {
  const classes = useStyles();
  const [PL, setPL] = useState('');

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setPL(getStrategySuffixForPL(bet, getStrategyAbbreviation(bet.trailing, bet.hedged), marketStartTime));
    }, 500);
    return () => {
      clearInterval(countdownInterval);
    };
  }, [marketStartTime, bet]);
  return (
    <td
      colSpan={4}
      className={clsx(classes.profitLoss, {
        [classes.profit]: PL < 0,
        [classes.loss]: PL > 0,
        [classes.breakEven]: PL === '0.00',
      })}
    >
      {PL}
    </td>
  );
};
