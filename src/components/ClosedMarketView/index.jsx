import React from 'react';
import { connect } from 'react-redux';
//* Components
import BetsPlaced from './BetsPlaced';
import MarketReport from './MarketReport';
import MarketSettlement from './MarketSettlement';
//* JSS
import useStyles from '../../jss/components/ClosedMarketView';

const ClosedMarketView = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <MarketSettlement />
      <div className={styles.tables}>
        <MarketReport />
        <BetsPlaced />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(ClosedMarketView);
