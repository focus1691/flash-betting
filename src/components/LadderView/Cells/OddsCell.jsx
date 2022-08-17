import React, { useMemo } from 'react';
import { getLTPstyle } from '../../../utils/ladder/DeconstructLadder';

const LTPCell = ({ price, isLTP, ltps }) => {
  const ltpStyle = useMemo(() => getLTPstyle(isLTP, ltps), [isLTP, ltps]);

  return (
    <div style={ltpStyle} className="td">
      {price}
    </div>
  );
};

export default LTPCell;
