import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import CountDown from './Countdown';
//* JSS
import useStyles from '../../jss/components/Sidebar/eventStyle';

const Event = ({
  marketOpen, marketName, marketStatus, marketStartTime, inPlay, pastEventTime, event,
}) => {
  const classes = useStyles();
  const [bgColour, setBGColor] = useState('#727272');

  const renderTitle = () => {
    if (marketOpen) {
      return `${new Date(
        marketStartTime,
      ).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })} ${marketName}${event.venue ? ` ${event.venue}` : ''}`;
    }
    return 'No Event Selected';
  };

  useEffect(() => {
    if (marketStatus === 'SUSPENDED') setBGColor('#e33232'); // Red
    else if (marketStatus === 'CLOSED') setBGColor('#303030'); // Black
    else if (new Date() > new Date(marketStartTime) && inPlay) setBGColor('#0c990c'); // Green
    else if (new Date() > new Date(marketStartTime) && pastEventTime) setBGColor('#ed8b25'); // Orange
    else setBGColor('#727272'); // Grey
  }, [marketStatus, inPlay, pastEventTime, marketStartTime]);

  return (
    <div className={classes.event}>
      <div>
        <div style={{ background: bgColour }}>
          <span>
            <CountDown />
          </span>
        </div>
      </div>
      <AppBar className={classes.eventTitle} position="static">
        <Typography variant="h6">
          {renderTitle()}
        </Typography>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketName: state.market.marketName,
  marketStartTime: state.market.marketStartTime,
  marketStatus: state.market.status,
  event: state.market.event,
  inPlay: state.market.inPlay,
  pastEventTime: state.market.pastEventTime,
  marketId: state.market.marketId,
  ladder: state.market.ladder,
  sortedLadder: state.market.sortedLadder,
  runners: state.market.runners,
  nonRunners: state.market.nonRunners,
  eventType: state.market.eventType,
});

export default connect(mapStateToProps)(Event);
