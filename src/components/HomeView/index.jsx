import React from 'react';
import { connect } from 'react-redux';
//* Custom Components
import Header from './Header';
import RecentBets from './RecentBets';
import TradingChart from './TradingChart';
//* JSS
import useStyles from '../../jss/components/HomeView/homeViewStyle';

const HomeView = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <>
        <Header />
        <TradingChart />
        <RecentBets />
      </>
      ;
    </div>
  );
};


export default connect(null)(HomeView);
