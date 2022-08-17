import React, { useMemo } from 'react';
import uuid from 'react-uuid';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash'
import clsx from 'clsx';
import { getVolumeFractional } from '../../../selectors/volumeSelector';
import { getLadderLTPs } from '../../../selectors/lastTradedPriceSelector';
//* JSS
import useStyles from '../../../jss/components/LadderView/volumeStyle';

const renderCandles = (price, ltps) => {
  const candles = [];
  if (!isEmpty(ltps)) {
    for (let i = 1; i < ltps.length; i++) {
      if (price === ltps[i]) {
        if (ltps[i] > ltps[i - 1]) {
          candles.push(<img key={`ladder-candlesticks-${uuid()}`} src={`${window.location.origin}/icons/Green_Candlestick.svg`} alt="" style={{ right: (i - 1) * 2 }} />);
        }
        else if (ltps[i] < ltps[i - 1]) {
          candles.push(<img key={`ladder-candlesticks-${uuid()}`} src={`${window.location.origin}/icons/Red_Candlestick.svg`} alt="" style={{ right: (i - 1) * 2 }} />);
        }
      }
    }
  }
  return candles;
}

const VolumeCell = ({ volFraction, ltps, price }) => {
  const candles = useMemo(() => renderCandles(price, ltps), [price, ltps])
  const classes = useStyles();

  return (
    <div className={clsx(classes.candleStick, 'td')} colSpan={3}>
      {candles}
      <div className={classes.volumeCol} style={{ width: `${volFraction * 5}%` }}>
        {volFraction}
      </div>
    </div>
  );
};

const mapStateToProps = (state, { selectionId, price }) => ({
  volFraction: getVolumeFractional(state.market.ladder, { selectionId, price }),
  ltps: getLadderLTPs(state.market.ladder, selectionId),
});

export default connect(mapStateToProps)(VolumeCell);
