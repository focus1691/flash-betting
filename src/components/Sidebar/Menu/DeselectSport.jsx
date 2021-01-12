import React from 'react';
//* @material-ui core
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/deselectSportStyle';

export default ({ type, data, index, submenuList, deselectSubmenu }) => {
  const classes = useStyles();
  const isLast = index === Object.keys(submenuList).length - 1;

  return (
    <ListItem
      button
      className={isLast ? classes.deselectLast : ''}
      onClick={() => {
        // console.log(index, type, Object.keys(submenuList).length, submenuList);
        // if they are nested within a search, we don't want to bring them all the way back
        if (type === 'EVENT_TYPE' || (type === 'submenuList' && index === 0)) {
          deselectSubmenu('ROOT');
        } else {
          deselectSubmenu(type, submenuList);
        }
      }}
    >
      <ListItemIcon className={isLast ? classes.deselectIconLast : ''}>
        <img src={`${window.location.origin}/icons/${index === 0 ? 'back-arrow.png' : 'caret-down.png'}`} alt="" />
      </ListItemIcon>
      <ListItemText className={classes.deselectText}>{data.name}</ListItemText>
    </ListItem>
  );
};
