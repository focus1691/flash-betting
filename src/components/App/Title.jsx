import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

const Title = ({
  marketOpen, marketName, event, marketStartTime,
}) => (
  marketOpen ? (
    <Helmet>
      <title>
        {`${new Date(marketStartTime).toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
        })} ${marketName}  ${event.venue || ''}`}
      </title>
    </Helmet>
  ) : null);

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketName: state.market.marketName,
  event: state.market.event,
  marketStartTime: state.market.marketStartTime,
});

export default connect(mapStateToProps)(Title);
