import React from 'react';
//* @material-ui core
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import MarketSaveButton from './MarketSaveButton';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/selectSportStyle';

export default ({ sports, setSubmenu }) => {
  const classes = useStyles();

  return sports.map((sport) => (
    <React.Fragment key={`select-sport-${sport.eventType.id}`}>
      <ListItem>
        <ListItem button onClick={setSubmenu(sport.eventType.name, 'EVENT_TYPE', {}, sport.eventType.id.match(/\d+/)[0], sport.eventType.id.startsWith('TC-') ? 'list-todays-card' : 'fetch-sport-data')}>
          <ListItemIcon className={classes.dropdownIcon}>
            <img
              src={window.location.origin + (true ? '/icons/caret-arrow-up.png' : '/icons/caret-arrow-up.png')}
              alt=""
            />
          </ListItemIcon>
          <ListItemText className={classes.name}>{sport.eventType.name}</ListItemText>
          <MarketSaveButton
            sport={{
              id: sport.eventType.id,
              name: sport.eventType.name,
              type: 'EVENT_TYPE',
              data: {},
            }}
          />
        </ListItem>
      </ListItem>
    </React.Fragment>
  ));
};
