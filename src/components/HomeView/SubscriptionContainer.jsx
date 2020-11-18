import React from 'react';
import clsx from  'clsx';

export default ({
  plan = 'Monthly', price = 9.99, color = 'gray', openPremiumMenu, setSelectedPremium, classes,
}) => (
  <div className={classes.subscriptionContainer}>
    <div className={classes.subscriptionHeader} style={color === 'green' ? { backgroundColor: '#26C281' } : null}>
      {plan}
    </div>
    <p className={classes.subscriptionPrice}>
      £
      {price}
    </p>
    <p className={classes.subscriptionText}>per month</p>
    <button
      type="button"
      className={clsx(classes.subscriptionButton, `${color}-button}`)}
      onClick={() => {
				  openPremiumMenu(true);
				  setSelectedPremium(plan.toLowerCase());
      }}
    >
      SIGN UP
    </button>
  </div>
);
