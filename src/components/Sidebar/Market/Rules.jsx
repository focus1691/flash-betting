import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const Rules = ({ market }) => {
  const [rules, setRules] = useState(null);

  useEffect(() => {
    if (market.description) {
      setRules(market.description.rules);
    }
  }, [market]);

  return (
    <div>
      {rules ? parse(rules.toString()) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  market: state.market.currentMarket,
  marketOpen: state.market.marketOpen,
  selection: state.market.runnerSelection,
});

export default connect(mapStateToProps)(Rules);
