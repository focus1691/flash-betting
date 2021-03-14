import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
//* @material-ui core
import { List, ListItem, ListItemText } from '@material-ui/core';
//* Components
import Chart from './Chart';
//* JSS
import useStyles from '../../../jss/components/HomeView/tradingChartStyle';
//* HTTP
import fetchData from '../../../http/fetchData';
//* Utils
import { sortSports } from '../../../utils/Sort';

export default () => {
  const classes = useStyles();
  const [selectedMarket, setSelectedMarket] = useState(localStorage.getItem('tradeChartMarket') || '');
  const [sportsList, setSportsList] = useState([]);
  const [trades, setTrades] = useState({});

  const handleMarketChange = (id) => () => {
    setSelectedMarket(id);
    localStorage.setItem('tradeChartMarket', id);
  };

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
        for (let i = 0; i < clearedOrders.length; i += 1) {
          clearedOrders[i].groupDate = moment(clearedOrders[i].settledDate).format('YYYY-MM-DD');
        }
        setTrades(_.groupBy(clearedOrders, 'eventTypeId'));

        if (clearedOrders.length > 0) {
          setSelectedMarket(clearedOrders[0].eventTypeId);
        }
      }
    };

    getAllSports();
    getTrades();
  }, []);

  return (
    <div className={classes.container}>
      <List className={classes.menu}>
        {sportsList.map(({ eventType: { id, name } }) =>
          trades[id] ? (
            <ListItem button key={`portfolio-${name}-${id}`} className={selectedMarket === id ? classes.menuItemActive : classes.menuItem} onClick={handleMarketChange(id)}>
              <ListItemText className={classes.marketName}>{name}</ListItemText>
            </ListItem>
          ) : null,
        )}
      </List>
      <Chart bets={trades[selectedMarket]} />
    </div>
  );
};
