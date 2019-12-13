import React, {memo} from 'react'
import { connect } from 'react-redux'
import { getVolume, getCandleStickColor } from '../../selectors/marketSelector';

const LadderVolumeCell = ({ltpList, vol, candleStickInfo}) => {
    if (candleStickInfo) console.log(candleStickInfo)
    const indexInLTPList = -1;
    const volumeVal = vol ? vol : 0;

    return (
        <div className={"candle-stick-col td"} colSpan={3}>
            {
            candleStickInfo ? 
            <img 
                src={`${window.location.origin}/icons/${candleStickInfo.color === 'R' ? 'red-candle.png' : 'green-candle.png'}`} 
                className={"candle-stick"} alt = "" style = {{right: candleStickInfo.index * 2}} /> 
            : null
            }
            <div className={"volume-col"} style={{width: `${volumeVal * 10}px`}}>
            {volumeVal === 0 ? null : volumeVal}
            </div>
        </div>
    )
}

const mapStateToProps = (state, {selectionId, price}) => {
    return {
        vol: getVolume(state.market.ladder, {selectionId, price}),
        candleStickInfo: getCandleStickColor(state.market.ladder, {selectionId, price})
    };  
  };

export default connect(mapStateToProps)(memo(LadderVolumeCell))