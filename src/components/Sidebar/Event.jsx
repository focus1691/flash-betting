import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import CountDown from './Countdown';
//* JSS
import useStyles from '../../jss/components/Sidebar/eventStyle';

import MarketStatus from './MarketStatus';

const Event = ({ marketOpen, marketStartTime, event }) => {
  const classes = useStyles();

  const renderTitle = () => {
    if (marketOpen) {
      return `${event.name ? event.name : event.venue ? event.venue : ''} ${moment(marketStartTime).format('LT')}`;
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
  marketStartTime: state.market.marketStartTime,
  event: state.market.event,
});

export default connect(mapStateToProps)(Event);
