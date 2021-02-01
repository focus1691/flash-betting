import React, { useState, useEffect } from 'react';
import moment from 'moment';
//* @material-ui core
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
//* JSS
import useStyles from '../../jss/components/HomeView/recentBetsStyle';
//* HTTP
import fetchData from '../../http/fetchData';
import getEventName from '../../utils/Market/GetEventNames';

export default () => {
  const classes = useStyles();
  const [recentBets, setRecentBets] = useState([]);

  useEffect(() => {
    (async function getRecentBets() {
      const { clearedOrders } = await fetchData('/api/list-recent-orders');
      if (clearedOrders) {
        setRecentBets(clearedOrders);
      }
    })();
  }, []);

  return (
    <div className={classes.container}>
      <Typography component="h2" className={classes.sectionHeader}>
        Recent Bets
      </Typography>
      <TableContainer component={Paper} className={classes.betTableContainer}>
        <Table className={classes.betTable}>
          <TableHead>
            <TableRow>
              <TableCell>Market</TableCell>
              <TableCell>Stake</TableCell>
              <TableCell>@</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Side</TableCell>
              <TableCell>Data / Time</TableCell>
              <TableCell>Outcome</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentBets.map(({eventTypeId, betId, sizeSettled, priceMatched, side, placedDate, betOutcome}) => (
              <TableRow style={{ backgroundcolor: 'red' }} key={`recent-bets-overview-${betId}`}>
                <TableCell>{getEventName(eventTypeId)}</TableCell>
                <TableCell>{sizeSettled}</TableCell>
                <TableCell>@</TableCell>
                <TableCell>{priceMatched}</TableCell>
                <TableCell>{side}</TableCell>
                <TableCell>{moment(placedDate).calendar()}</TableCell>
                <TableCell>{betOutcome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
