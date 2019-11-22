import React, { useState } from "react";
import { connect } from "react-redux";
import { openLiveStream } from "../../actions/draggable";

const LiveStream = props => {

  const [transparent, setTransparent] = useState(false);

  return props.market && props.open ? (
    <div className={"popup-live-stream"} style={{ opacity: transparent ? 0.5 : 1 }}>
      <div>
        <span className={"popup-graph-toggle-transparency"} onClick={e => setTransparent(!transparent)}>{transparent ? "Solid" : "Transparent"}</span>
        <img
          alt={"Close"}
          className={"close-popup-graph"}
          src={`${window.location.origin}/icons/error.png`}
          onClick={props.onOpenLiveStream()}
        />
      </div>
      <iframe src={`https://videoplayer.betfair.com/GetPlayer.do?tr=1&mID=${props.market.marketId}&allowPopup=false`}
        width="500px"
        height="500px"
        frameBorder='0'
        allow='autoplay; encrypted-media'
        allowFullScreen
        title='video'
      />
    </div>
  ) : null;
};

const mapStateToProps = state => {
  return {
    market: state.market.currentMarket,
    open: state.draggable.liveStreamOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOpenLiveStream: () => e => dispatch(openLiveStream())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LiveStream);