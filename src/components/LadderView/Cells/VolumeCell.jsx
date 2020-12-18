import React, { memo } from 'react';
import { connect } from 'react-redux';
import clsx from  'clsx';
import { getCandleStickColor, getVolume, getVolumeDivider } from '../../../selectors/marketSelector';
//* JSS
import useStyles from '../../../jss/components/LadderView/volumeStyle';

const LadderVolumeCell = memo(({
  ltpList, price, selectionId, vol, candleStickInfo, volFraction,
}) => {
  const classes = useStyles();
  const volumeVal = vol || 0;
  return (
    <div className={clsx(classes.candleStick, 'td')} colSpan={3}>
      {candleStickInfo.map((item, idx) => (
        <img
          key={`ladder-volume-${selectionId}-${price}-${idx}`}
          src={`${window.location.origin}/icons/${item.color === 'R' ? 'red-candle.png' : 'green-candle.png'}`}
          alt=""
          style={{ right: item.index * 2 }}
        />
      ))}
      <div className={classes.volumeCol} style={{ width: `${volFraction / 2}%` }}>
        {volumeVal === 0 ? null : volumeVal}
      </div>
    </div>
  );
});

const isMoving = (prevProps, nextProps) => {
  if (nextProps.isMoving) {
    return true;
  }
  return false;
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

export default connect(mapStateToProps)(memo(LadderVolumeCell, isMoving));
