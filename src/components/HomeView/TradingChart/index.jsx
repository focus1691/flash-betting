import React, { useState, useEffect } from 'react';
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
  const [sportsList, setSportsList] = useState([]);

  useEffect(() => {
    const getAllSports = async () => {
      const sportsList = await fetchData('/api/get-all-sports');
      if (sportsList) {
        setSportsList(sortSports(sportsList));
      }
    };
    getAllSports();
  }, []);

  return (
    <div className={classes.container}>
      <List className={classes.menu}>
        {sportsList.map(({ eventType }) => (
          <ListItem button key={`portfolio-${eventType.name}-${eventType.id}`} className={classes.menuItem}>
            <ListItemText className={classes.marketName}>{eventType.name}</ListItemText>
          </ListItem>
        ))}
      </List>
      <Chart />
    </div>
  );
};
