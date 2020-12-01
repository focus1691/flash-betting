import React from 'react';
//* JSS
import useStyles from '../../jss/components/GridView/SuspendedWarning';

export default ({ marketStatus }) => {
  const classes = useStyles();
  return (
    <p style={marketStatus !== 'SUSPENDED' ? { display: 'none' } : {}} className={classes.suspendedMessage}>
      {marketStatus}
    </p>
  );
};
