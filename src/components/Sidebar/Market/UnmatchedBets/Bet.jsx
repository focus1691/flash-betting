import React, { useCallback, memo } from 'react';
import { colorForOrder, twoDecimalPlaces } from '../../../../utils/Bets/BettingCalculations';

import BetPL from './BetPL';

const Bet = memo(({
  bet, handleRightClick, cancelOrder, marketStartTime,
}) => {
  const handleClick = useCallback(() => {
    cancelOrder(bet);
  }, [cancelOrder, bet]);

  return (
    <tr
      id="menu-unmatched-bet"
      style={colorForOrder(bet.side, bet.strategy)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleRightClick(bet);
      }}
    >
      <button type="button" className="cancel-order-btn" style={{ height: '22px', width: 'auto' }} onClick={handleClick}>
        <img src={`${window.location.origin}/icons/error.png`} alt="X" />
      </button>
      <td>{twoDecimalPlaces(bet.price)}</td>
      <td>{bet.sizeRemaining || bet.size}</td>
      <BetPL marketStartTime={marketStartTime} bet={bet} />
    </tr>
  );
});

export default Bet;
