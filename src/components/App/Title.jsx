import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

const Title = ({ marketOpen, marketName, event, marketStartTime }) => {
  return marketOpen ? (
    <Helmet>
      <title>{`${event.name || ''} ${marketName} ${moment(marketStartTime).format('LT')}`}</title>
    </Helmet>
  ) : null;
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketName: state.market.marketName,
  event: state.market.event,
  marketStartTime: state.market.marketStartTime,
});

export default connect(mapStateToProps)(Title);
