import React from 'react';
//* @material-ui core
import { List, ListItem, ListItemText } from '@material-ui/core';
//* JSS
import useStyles from '../../jss/components/HomeView/headerStyle';

export default () => {
  const classes = useStyles();

  return (
    <div>
      <List>
        <ListItem button>
          <ListItemText className={classes.name}>Soccer</ListItemText>
          <ListItemText className={classes.name}>Basketball</ListItemText>
        </ListItem>
      </List>
    </div>
  );
};
