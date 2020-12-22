import React from 'react';

const renderContent = (text, img, alt, classes) => (
  <div className={classes}>
    <span className={classes}>{text}</span>
    <img src={window.location.origin + img} alt={{ alt }} />
  </div>
);

const renderRaceStatus = (marketOpen, status, inPlay, classes) => {
  if (!marketOpen) return null;
  if (inPlay && status !== 'CLOSED') {
    return renderContent('Going in-play', '/icons/checked.png', 'Active');
  }

  switch (status) {
    case 'OPEN':
      return renderContent('Going in-play', '/icons/inactive.png', 'Active', classes);
    case 'SUSPENDED':
      return renderContent('Not Going in-play', '/icons/X_Button.svg', 'Suspended', classes);
    default:
      return null;
  }
};

export { renderRaceStatus };
