import React, { memo, useMemo } from 'react';
import { twoDecimalPlaces } from '../../../../utils/Bets/BettingCalculations';

const MatchedBet = memo(({ bet }) => {
  const style = useMemo(() => ({
    backgroundColor: bet.side === 'BACK' ? '#007aaf' : '#d4696b',
  }), [bet.side]);

  return (
    <tr>
      <td style={style}>{`${bet.sizeMatched} @ ${twoDecimalPlaces(bet.price)}`}</td>
    </tr>
  );
});

export { MatchedBet };
