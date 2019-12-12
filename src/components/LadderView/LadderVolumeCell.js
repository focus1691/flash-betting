import React, {memo} from 'react'
import { connect } from 'react-redux'
import { getVolume } from '../../selectors/marketSelector';

const LadderVolumeCell = ({selectionId, price, ltpList, vol}) => {
    const indexInLTPList = -1;
    const volumeVal = vol ? vol : 0;

    return (
        <div className={"candle-stick-col td"} colSpan={3}>
            {
            indexInLTPList >= 0 ? 
            <img 
                src={`${window.location.origin}/icons/${ltpList[indexInLTPList].color === 'R' ? 'red-candle.png' : 'green-candle.png'}`} 
                className={"candle-stick"} alt = "" style = {{right: indexInLTPList * 2}} /> 
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
        vol: getVolume(state.market.ladder, {selectionId: selectionId, price: price}),
        
    };  
  };

export default connect(mapStateToProps)(memo(LadderVolumeCell))