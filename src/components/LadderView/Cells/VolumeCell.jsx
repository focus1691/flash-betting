import React, { memo } from 'react';
import uuid from 'react-uuid';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { getCandleStickColor, getVolume, getVolumeDivider } from '../../../selectors/marketSelector';
//* JSS
import useStyles from '../../../jss/components/LadderView/volumeStyle';

const VolumeCell = ({ price, selectionId, vol, candleStickInfo, volFraction }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.candleStick, 'td')} colSpan={3}>
      {candleStickInfo.map((item) => (
        <img key={`ladder-volume-${selectionId}-${price}-${uuid()}`} src={`${window.location.origin}/icons/${item.color === 'R' ? 'Red_Candlestick.svg' : 'Green_Candlestick.svg'}`} alt="" style={{ right: item.index * 2 }} />
      ))}
      <div className={classes.volumeCol} style={{ width: `${volFraction / 2}%` }}>
        {vol || null}
      </div>
    </div>
  );
};

const mapStateToProps = (state, { selectionId, price }) => ({
  price,
  selectionId,
  vol: getVolume(state.market.ladder, { selectionId, price }),
  volFraction: getVolumeDivider(state.market.ladder, { selectionId, price }),
  candleStickInfo: getCandleStickColor(state.market.ladder, {
    selectionId,
    price,
  }),
});

export default connect(mapStateToProps)(memo(VolumeCell));
