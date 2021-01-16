import React from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import CountDown from './Countdown';
//* JSS
import useStyles from '../../jss/components/Sidebar/eventStyle';

import MarketStatus from './MarketStatus';

const Event = ({ marketOpen, marketName, marketStartTime, event }) => {
  const classes = useStyles();

  const renderTitle = () => {
    if (marketOpen) {
      return `${new Date(marketStartTime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })} ${marketName}${event.venue ? ` ${event.venue}` : ''}`;
    }
    return 'No Event Selected';
  };

  return (
    <div className={classes.event}>
      <div>
        <span>
          <CountDown />
        </span>
      </div>
      <MarketStatus />
      <AppBar className={classes.eventTitle} position="static">
        <Typography variant="h6">{renderTitle()}</Typography>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketName: state.market.marketName,
  marketStartTime: state.market.marketStartTime,
  event: state.market.event,
});

export default connect(mapStateToProps)(Event);
