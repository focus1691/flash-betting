import React, { useCallback, memo } from 'react';
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
      id={classes.betRow}
      style={colorForOrder(bet.side, bet.strategy)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleRightClick(bet);
      }}
    >
      <button type="button" className={classes.cancelBetButton} onClick={handleClick}>
        <img src={`${window.location.origin}/icons/error.png`} alt="X" />
      </button>
      <td>{twoDecimalPlaces(bet.price)}</td>
      <td>{bet.sizeRemaining || bet.size}</td>
      <BetPL marketStartTime={marketStartTime} bet={bet} />
    </tr>
  );
});

export default Bet;
