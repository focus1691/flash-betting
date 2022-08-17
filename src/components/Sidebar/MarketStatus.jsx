import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

const MarketStatus = ({ marketOpen, marketStartTime, marketStatus, inPlay, pastEventTime }) => {
  const [status, setStatus] = useState('Select a market');
  const [statusCircle, setStatusCircle] = useState('ClosedBlack_Light.svg');

  useEffect(() => {
    if (!marketOpen && marketStatus !== 'CLOSED') {
      setStatus('Select a market');
      setStatusCircle('ClosedBlack_Light.svg');
    } else if (marketStatus === 'SUSPENDED') {
      setStatus('Suspended');
      setStatusCircle('RedSuspended_Icon.svg');
    } else if (marketStatus === 'CLOSED') {
      setStatus('Closed');
      setStatusCircle('ClosedBlack_Light.svg');
    } else if (new Date() > new Date(marketStartTime) && inPlay) {
      setStatus('Live');
      setStatusCircle('LiveGreen_Icon.svg');
    } else if (new Date() > new Date(marketStartTime) && pastEventTime) {
      setStatus('Waiting');
      setStatusCircle('OrangeWaiting_Icon.svg');
    } else {
      setStatusCircle('ClosedBlack_Light.svg');
      if (marketStatus === 'OPEN') {
        setStatus('Market open');
      }
    }
  }, [inPlay, marketOpen, marketStartTime, marketStatus, pastEventTime]);

  return (
    <div>
      <img src={`${window.location.origin}/icons/${statusCircle}`} alt="" />
      <span>{status}</span>
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketStartTime: state.market.marketStartTime,
  marketStatus: state.market.status,
  inPlay: state.market.inPlay,
  pastEventTime: state.market.pastEventTime,
});

export default connect(mapStateToProps)(MarketStatus);
