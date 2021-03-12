import React, { useEffect, useState } from 'react';
//* @material-ui core
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ListItemText, Divider } from '@material-ui/core';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/menuStyle';
//* HTTP
import fetchData from '../../../http/fetchData';

const ActiveBets = () => {
  const classes = useStyles();
  const [bets, setBets] = useState([]);

  const openMarket = (marketId) => () => {
    window.open(`/dashboard?marketId=${marketId}`);
  };

  useEffect(() => {
    const getActiveBets = async () => {
      const bets = await fetchData('/api/get-events-with-active-bets');

      if (bets) setBets(bets);
    };
    getActiveBets();
  }, []);

  return (
    <List>
      {bets.map((bet) => (
        <>
          <ListItem key={`active-bets-${bet.marketId}`} button onClick={openMarket(bet.marketId)}>
            <ListItemText className={classes.activeBetName}>{bet.event.name}</ListItemText>
          </ListItem>
          <Divider />
        </>
      ))}
    </List>
  );
};

export default ActiveBets;
