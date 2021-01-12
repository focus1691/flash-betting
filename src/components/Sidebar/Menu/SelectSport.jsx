import React from 'react';
//* @material-ui core
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import MarketSaveButton from './MarketSaveButton';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/selectSportStyle';

export default ({ sports, setSubmenu }) => {
  const classes = useStyles();

  return sports.map(({ eventType: { id, name } }) => (
    <React.Fragment key={`select-sport-${id}`}>
      <ListItem>
        <ListItem button onClick={setSubmenu(id, name, 'EVENT_TYPE', {}, id.match(/\d+/)[0], id.startsWith('TC-') ? 'list-todays-card' : 'fetch-sport-data')}>
          <ListItemIcon className={classes.dropdownIcon}>
            <img
              src={window.location.origin + (true ? '/icons/caret-arrow-up.png' : '/icons/caret-arrow-up.png')}
              alt=""
            />
          </ListItemIcon>
          <ListItemText className={classes.name}>{name}</ListItemText>
          <MarketSaveButton
            sport={{
              id,
              name,
              type: 'EVENT_TYPE',
              data: {},
            }}
          />
        </ListItem>
      </ListItem>
    </React.Fragment>
  ));
};
