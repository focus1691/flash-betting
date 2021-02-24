import React from 'react';
//* @material-ui core
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import MarketSaveButton from './MarketSaveButton';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/selectSportStyle';

export default ({ sports, setSubmenu }) => {
  const classes = useStyles();

  return sports.map(({ eventType: { id, name } }) => (
    <ListItem key={`select-sport-${id}`}>
      <ListItem button onClick={setSubmenu(id, name, id.match(/\d+/)[0])}>
        <ListItemIcon className={classes.dropdownIcon}>
          <img src={`${window.location.origin}/icons/caret-arrow-up.png`} alt="" />
        </ListItemIcon>
        <ListItemText className={classes.name}>{name}</ListItemText>
        <MarketSaveButton
          id={id}
          sportId={id}
          name={name}
          nodes={[]}
        />
      </ListItem>
    </ListItem>
  ));
};
