import React, { useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export default (({ cancelOrders, side, layFirstCol }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    switch (side) {
      case 'back':
        setText(layFirstCol && side === 'back' ? 'back' : 'lay');
        break;
      case 'lay':
        setText(layFirstCol && side === 'lay' ? 'lay' : 'back');
        break;
      default:
        break;
    }
  }, [layFirstCol, side]);

  const handleClick = () => {
    cancelOrders();
  };

  return (
    <Tooltip title={`Cancel selection ${text} bets`} aria-label="Cancel selections">
      <div className="th" onClick={handleClick} />
    </Tooltip>
  );
});
