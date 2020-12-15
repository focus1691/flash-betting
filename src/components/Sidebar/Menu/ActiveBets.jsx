import React, { useEffect, useState } from 'react';
//* @material-ui core
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ListItemText, Divider } from '@material-ui/core';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu';
//* HTTP
import fetchData from '../../../http/fetchData';

const ActiveBets = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);

  const openMarket = (marketId) => () => {
    window.open(`/dashboard?marketId=${marketId}`);
  };

  useEffect(() => {
    const getActiveBets = async () => {
      const { result } = fetchData('/api/get-events-with-active-bets');

      if (result) {
        setEvents(result);
      }
    };
    getActiveBets();
  }, []);

  return (
    <List>
      {Array.isArray(events) &&
        events.map((event) => (
          <>
            <ListItem key={`active-bets-${event.marketId}`} button onClick={openMarket(event.marketId)}>
              <ListItemText className={classes.activeBetName}>{event.marketName}</ListItemText>
            </ListItem>
            <Divider />
          </>
        ))}
    </List>
  );
};

export default ActiveBets;
