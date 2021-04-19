import React, { useCallback, memo } from 'react';
import uuid from 'react-uuid';
import BetPL from './BetPL';
//* Utils
import { colorForOrder, twoDecimalPlaces } from '../../../../utils/Bets/BettingCalculations';
//* JSS
import useStyles from '../../../../jss/components/Sidebar/market/betRowStyle';

const Bet = memo(({ bet, handleRightClick, cancelOrder, marketStartTime }) => {
  const classes = useStyles();
  const handleClick = useCallback(() => {
    cancelOrder(bet);
  }, [cancelOrder, bet]);

  return (
    <tr
      key={`unmatched-bet-sidebar-${uuid()}`}
      className={classes.betRow}
      style={colorForOrder(bet.side, bet.strategy)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleRightClick(bet);
      }}
    >
      <td colSpan={2}>{twoDecimalPlaces(bet.price)}</td>
      <td colSpan={2}>{bet.sizeRemaining || bet.size}</td>
      <BetPL marketStartTime={marketStartTime} bet={bet} />
      <td colSpan={1} className={classes.cancelBetButton}>
        <button type="button" onClick={handleClick}>
          <img src={`${window.location.origin}/icons/X_Button.svg`} alt="X" />
        </button>
      </td>
    </tr>
  );
});

export default Bet;
