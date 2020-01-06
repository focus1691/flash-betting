import React, { memo } from 'react';
import { connect } from 'react-redux';
import { getCandleStickColor, getVolume, getVolumeDivider } from '../../selectors/marketSelector';

const LadderVolumeCell = ({ltpList, vol, candleStickInfo, volFraction}) => {
    const volumeVal = vol ? vol : 0;
    
    return (
        <div className={"candle-stick-col td"} colSpan={3}>
            {
            candleStickInfo.map(item =>  
                <img 
                    src={`${window.location.origin}/icons/${item.color === 'R' ? 'red-candle.png' : 'green-candle.png'}`} 
                    className={"candle-stick"} alt = "" style = {{right: item.index * 2}} /> 
            )}
            <div className={"volume-col"} style={{width: `${(volFraction) / 2}%`}}>
                {volumeVal === 0 ? null : volumeVal}
            </div>
        </div>
    )
}

const isMoving = (prevProps, nextProps) => {
    if (nextProps.isMoving) {
        return true;
    } else {
        return false;
    }
}

const mapStateToProps = (state, {selectionId, price}) => {
    return {
        vol: getVolume(state.market.ladder, {selectionId, price}),
        volFraction: getVolumeDivider(state.market.ladder, {selectionId, price}),
        candleStickInfo: getCandleStickColor(state.market.ladder, {selectionId, price})
    };  
  };

export default connect(mapStateToProps)(memo(LadderVolumeCell, isMoving))