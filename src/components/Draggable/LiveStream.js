import React, { useState, Component  } from "react";
import { connect } from "react-redux";
import ReactPlayer from 'react-player'
import { openLiveStream } from "../../actions/draggable";
import "../../../node_modules/video-react/dist/video-react.css";

const LiveStream = props => {

  const [transparent, setTransparent] = useState(false);

  if (props.market) {
      console.log(props.market);
  }

  return props.market && props.open ? (
    <div className={"popup-live-stream"} style={{ opacity: transparent ? 0.5 : 1 }}>
      <div>
        <span className={"popup-graph-toggle-transparency"} onClick={e => setTransparent(!transparent)}>{transparent ? "Solid" : "Transparent"}</span>
        {/* <img
          alt={"Close"}
          className={"close-popup-graph"}
          src={`${window.location.origin}/icons/error.png`}
          onClick={props.onOpenLiveStream()}
        /> */}
      </div>
      <ReactPlayer url={`https://videoplayer.betfair.com/GetPlayer.do?tr=1&mID=${props.market.marketId}&allowPopup=false`} playing />
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
