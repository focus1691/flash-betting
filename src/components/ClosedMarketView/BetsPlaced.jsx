import React from 'react';
import clsx from 'clsx';
//* @material-ui core
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
//* JSS
import useStyles from '../../jss/components/ClosedMarketView/betsPlacedStyle';
//* Data
import { betsPlacedColumns as columns } from '../../data/tables';

const calculateNewPlacedDate = (bet) => {
  const betPlacedDate = new Date(bet.placedDate);
  const currentDate = new Date(Date.now()).getDate();
  const placedDate = betPlacedDate.getDate();

  const currentMonth = new Date(Date.now()).getMonth();
  const placedMonth = betPlacedDate.getMonth();

  const betPlacedOnDiffDay = currentMonth !== placedMonth || placedDate > currentDate || placedDate < currentDate;

  const newPlacedDate = betPlacedOnDiffDay ? betPlacedDate.toLocaleString('en-GB', { hour12: false }) : betPlacedDate.toLocaleTimeString(betPlacedDate, { hour12: false });

  return { ...bet, placedDate: newPlacedDate };
};

const getRunner = (bet, runners) => ({ ...bet, selection: runners[bet.selectionId] });

const getStatus = (bet, runners) => {
  if (runners) {
    return { ...bet, win: runners[bet.selectionId].status === 'WINNER' };
  }
  return bet;
};

const BetsPlaced = ({ matchedBets, runners = [] }) => {
  const classes = useStyles();
  const runnersObject = {};
  runners.map((runner) => {
    runnersObject[runner.selectionId] = runner.runnerName;
  });

  // const sortedMatchedBets = matchedBets.sort((a, b) => Date.parse(b.placedDate) - Date.parse(a.placedDate));
  const rows = matchedBets.map((bet) => getStatus(getRunner(calculateNewPlacedDate(bet), runnersObject)));

  return (
    <div className={classes.betsPlaced}>
      <Typography component="h1" variant="h2" className={classes.title}>
        Bets Placed
      </Typography>
      <Paper className={classes.container}>
        <div className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    const isSideBack = row.side === 'BACK';
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'sizeMatched' ? (
                          <span
                            className={clsx(classes.betSide, {
                              [classes.backText]: isSideBack,
                              [classes.layText]: !isSideBack,
                            })}
                          >
                            {isSideBack ? 'BACK' : 'LAY'}
                          </span>
                        ) : null}
                        {column.id === 'win' ? (
                          <span
                            className={clsx(classes.betOutcome, {
                              [classes.betWin]: column.win,
                              [classes.betLose]: !column.win,
                            })}
                          >
                            {column.win ? 'Won' : 'Lost'}
                          </span>
                        ) : null}
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </div>
  );
};

export default BetsPlaced;
