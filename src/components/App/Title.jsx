import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
//* Utils
import formatEventName from '../../utils/Market/FormatEventName';

const Title = ({ marketOpen, marketName, event, eventType, marketStartTime }) => {
  return marketOpen ? (
    <Helmet>
      <title>{formatEventName(marketName, marketStartTime, event, eventType)}</title>
    </Helmet>
  ) : null;
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketName: state.market.marketName,
  event: state.market.event,
  eventType: state.market.eventType,
  marketStartTime: state.market.marketStartTime,
});

export default connect(mapStateToProps)(Title);
