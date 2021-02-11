import React from 'react';
import uuid from 'react-uuid';
import clsx from 'clsx';
//* @material-ui core
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
//* Utils
import { getPLForRunner, getLossForRunner } from '../../utils/Bets/GetProfitAndLoss';
//* JSS
import useStyles from '../../jss/components/ClosedMarketView/marketReportStyle';
//* Data
import { columns } from '../../data/marketReport';

const MarketReport = ({ matchedBets, runners }) => {
  const classes = useStyles();

  const selectionWithBets = {};

  matchedBets.forEach((bet) => {
    bet.price = bet.averagePriceMatched;
    bet.size = bet.sizeMatched;
    bet.marketId = runners.marketId;
    if (selectionWithBets[bet.selectionId]) selectionWithBets[bet.selectionId].push(bet);
    else selectionWithBets[bet.selectionId] = [bet];
  });

  const rows = runners.map(({ selectionId, runnerName, status }) => {
    const win = matchedBets ? getPLForRunner(runners.marketId, selectionId, { matched: matchedBets }).toFixed(2) : 0;
    const lose = matchedBets ? getLossForRunner(runners.marketId, selectionId, { matched: matchedBets }).toFixed(2) : 0;
    console.log(status);
    return {
      selection: runnerName,
      win,
      lose,
      settled: status === 'WINNER' ? win : lose,
      isComplete: status !== 'ACTIVE',
      isWinner: status === 'WINNER',
    };
  });

  return (
    <div className={classes.marketReport}>
      <Typography component="h1" variant="h2" className={classes.title}>
        Closed Market Report
      </Typography>
      <Paper className={classes.container}>
        <div className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.title} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow hover key={`market-report-${uuid()}`}>
                  {columns.map(({ title, align, format }) => {
                    console.log(row.isComplete);
                    const value = row[title];
                    const isBetOnSelection = title === 'win' || title === 'lose' || title === 'settled';
                    const color = isBetOnSelection ? (parseFloat(value) < 0 ? 'red' : 'green') : 'black';
                    return (
                      <TableCell key={title} align={align}>
                        {title === 'result' ? (
                          <span
                            className={clsx(classes.marketOutcome, {
                              [classes.selectionPending]: !row.isComplete,
                              [classes.selectionWin]: row.isComplete && row.isWinner,
                              [classes.selectionLose]: row.isComplete && !row.isWinner,
                            })}
                          >
                            {row.isComplete ? (row.isWinner ? 'Won' : 'Lost') : 'N/A'}
                          </span>
                        ) : null}
                        <span style={{ color, fontWeight: isBetOnSelection ? 'bold' : 'normal' }}>{format && typeof value === 'number' ? format(value) : value}</span>
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

export default MarketReport;
