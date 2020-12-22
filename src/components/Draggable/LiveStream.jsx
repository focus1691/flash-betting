import React from 'react';
import { connect } from 'react-redux';
//* Actions
import { openLiveStream } from '../../actions/draggable';
//* JSS
import useStyles from '../../jss/components/videoStyle';

const LiveStream = ({ marketId, open, openLiveStream }) => {
  const classes = useStyles();

  return marketId && open ? (
    <div className={classes.video}>
      <div>
        <img alt="Close" className={classes.closeButton} src={`${window.location.origin}/icons/X_Button.svg`} onClick={openLiveStream} />
      </div>
      <iframe src={`https://videoplayer.betfair.com/GetPlayer.do?tr=1&mID=${marketId}&allowPopup=false`} width="500px" height="500px" frameBorder="0" allow="autoplay; encrypted-media" title="video" />
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  marketId: state.market.marketId,
  open: state.draggable.liveStreamOpen,
});

const mapDispatchToProps = { openLiveStream };

export default connect(mapStateToProps, mapDispatchToProps)(LiveStream);
