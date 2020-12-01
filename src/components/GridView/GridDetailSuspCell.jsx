import React from 'react';
import { iconForEvent } from '../../utils/Market/EventIcons';
//* JSS
import useStyles from '../../jss/components/GridView/GridDetailCell';

export default ({ sportId, name, number, logo, onSelectRunner }) => {
  const classes = useStyles();
  const handleImageError = (sportId) => (e) => {
    e.target.onerror = null;
    e.target.src = iconForEvent(parseInt(sportId));
  };

  return (
    <td className={classes.gridRunnerDetails} onClick={onSelectRunner}>
      <img src={logo} alt="" onError={handleImageError(sportId)} />
      <span>{`${number}${name}`}</span>
    </td>
  );
};
