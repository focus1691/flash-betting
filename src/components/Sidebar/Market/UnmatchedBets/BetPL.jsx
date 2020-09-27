import React, { useState, useEffect } from 'react';
import { getStrategyAbbreviation, PLColor, getStrategySuffixForPL } from '../../../../utils/Bets/BettingCalculations';

export default ({ bet, marketStartTime }) => {
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
    <td id="pl-style" style={PLColor(PL)}>
      {PL}
    </td>
  );
};
