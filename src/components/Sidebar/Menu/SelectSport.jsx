import { ListItem, ListItemText } from '@material-ui/core';
import React from 'react';
import MarketSaveButton from './MarketSaveButton';

export default ({ sports, setSubmenu }) =>
  sports.map((sport) => (
    <React.Fragment key={`select-sport-${sport.eventType.id}`}>
      <ListItem>
        <MarketSaveButton
          sport={{
            id: sport.eventType.id,
            name: sport.eventType.name,
            type: 'EVENT_TYPE',
            data: {},
          }}
        />
        <ListItem button onClick={setSubmenu(sport.eventType.name, 'EVENT_TYPE', {}, sport.eventType.id.match(/\d+/)[0], sport.eventType.id.startsWith('TC-') ? 'list-todays-card' : 'fetch-sport-data')}>
          <ListItemText>{sport.eventType.name}</ListItemText>
        </ListItem>
      </ListItem>
    </React.Fragment>
  ));
