import React from 'react';
//* JSS
import useStyles from '../../../jss/components/HomeView/chartStyle';

const Chart = () => {
  const classes = useStyles();

  return (
    <div className={classes.chart} />
  );
};

export default Chart;
