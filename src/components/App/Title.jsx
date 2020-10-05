import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

const Title = ({ marketOpen, market }) => (
  marketOpen ? (
    <Helmet>
      <title>
        {`${new Date(market.marketStartTime).toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
        })} ${market.marketName}  ${market.event.venue || ''}`}
      </title>
    </Helmet>
  ) : null);

const mapStateToProps = (state) => ({
  market: state.market.currentMarket,
  marketOpen: state.market.marketOpen,
});

export default connect(mapStateToProps)(Title);
