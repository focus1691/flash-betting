import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import React from 'react';

export default ({ type, data, index, submenuList, deselectSubmenu }) => (
  <ListItem
    button
    onClick={() => {
      console.log(index, type, Object.keys(submenuList).length, submenuList);
      // if they are nested within a search, we don't want to bring them all the way back
      if (type === 'EVENT_TYPE' || type === 'submenuList' && index === 0) {
        deselectSubmenu('ROOT');
      } else {
        deselectSubmenu(type, submenuList);
      }
    }}
  >
    <ListItemIcon>
      <img src={`${window.location.origin}/icons/${index === 0 ? 'back-arrow.png' : 'caret-down.png'}`} alt="" />
    </ListItemIcon>
    <ListItemText style={{ color: index === Object.keys(submenuList).length - 1 ? 'black' : '#999797' }}>{data.name}</ListItemText>
  </ListItem>
);
