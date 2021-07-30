import React, { useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export default ({ cancelBetsOnSide, side, layFirstCol }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    switch (side) {
      case 'back':
        setText(layFirstCol && side === 'BACK' ? 'back' : 'lay');
        break;
      case 'lay':
        setText(layFirstCol && side === 'LAY' ? 'lay' : 'back');
        break;
      default:
        break;
    }
  }, [layFirstCol, side]);

  return (
    <Tooltip title={`Cancel selection ${text} bets`} aria-label="Cancel selections">
      <div className="th" role="button" tabIndex="0" onClick={() => cancelBetsOnSide(side)} />
    </Tooltip>
  );
};
