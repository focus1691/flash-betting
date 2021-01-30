import React, { useState, useEffect } from 'react';
import _ from 'lodash';
//* @material-ui core
import { List, ListItem, ListItemText } from '@material-ui/core';
//* Components
import Chart from './Chart';
//* JSS
import useStyles from '../../../jss/components/HomeView/tradingChartStyle';
//* HTTP
import fetchData from '../../../http/fetchData';
//* Utils
import { sortSports } from '../../../utils/Algorithms/SortSports';

export default () => {
  const classes = useStyles();
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [sportsList, setSportsList] = useState([]);
  const [trades, setTrades] = useState({});

  console.log(trades);

  useEffect(() => {
    const getAllSports = async () => {
      const sportsList = await fetchData('/api/get-all-sports');
      if (sportsList) {
        setSportsList(sortSports(sportsList));
      }
    };

    const getTrades = async () => {
      const { clearedOrders } = await fetchData('/api/list-cleared-orders');
      if (clearedOrders) {
        setTrades(_.groupBy(clearedOrders, 'eventTypeId')); 
      }
    };

    getAllSports();
    getTrades();
  }, []);

  return (
    <div className={classes.container}>
      <List className={classes.menu}>
        {sportsList.map(({ eventType: { id, name } }) => trades[id] ? (
          <ListItem button key={`portfolio-${name}-${id}`} className={classes.menuItem} onClick={() => setSelectedMarket(id)} >
            <ListItemText className={classes.marketName}>{name}</ListItemText>
          </ListItem>
        ) : null)}
      </List>
      <Chart data={trades[selectedMarket]} />
    </div>
  );
};
