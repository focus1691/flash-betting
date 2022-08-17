import React from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import CountDown from './Countdown';
//* Utils
import formatEventName from '../../utils/Market/FormatEventName';
//* JSS
import useStyles from '../../jss/components/Sidebar/eventStyle';

import MarketStatus from './MarketStatus';

const Event = ({ marketOpen, marketStatus, marketName, marketStartTime, event, eventType }) => {
  const classes = useStyles();

  const renderTitle = () => {
    if (marketOpen) {
      return formatEventName(marketName, marketStartTime, event, eventType);
    }
    if (marketStatus === 'CLOSED') {
      return 'Market is closed';
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
  marketStatus: state.market.status,
  marketName: state.market.marketName,
  marketStartTime: state.market.marketStartTime,
  event: state.market.event,
  eventType: state.market.eventType,
});

export default connect(mapStateToProps)(Event);
