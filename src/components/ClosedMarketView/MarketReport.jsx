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
//* Utils
import { getPLForRunner, getLossForRunner } from '../../utils/Bets/GetProfitAndLoss';
//* JSS
import useStyles from '../../jss/components/ClosedMarketView/marketReportStyle';

const columns = [
  { id: 'selection', label: 'Selection' },
  { id: 'win', label: 'If Win' },
  { id: 'lose', label: 'If Lose' },
  { id: 'settled', label: 'Settled' },
  { id: 'result', label: 'Result' },
];

const MarketReport = ({ matchedBets, runners }) => {
  const classes = useStyles();

  const selectionWithBets = {};

  matchedBets.map((bet) => {
    bet.price = bet.averagePriceMatched;
    bet.size = bet.sizeMatched;
    bet.marketId = runners.marketId;
    if (selectionWithBets[bet.selectionId]) selectionWithBets[bet.selectionId].push(bet);
    else selectionWithBets[bet.selectionId] = [bet];
  });

  const rows = runners.map((runner) => {
    const win = matchedBets !== undefined ? getPLForRunner(runners.marketId, runner.selectionId, { matched: matchedBets }).toFixed(2) : 0;
    const lose = matchedBets !== undefined ? getLossForRunner(runners.marketId, runner.selectionId, { matched: matchedBets }).toFixed(2) : 0; // placeholder
    return {
      selection: runner.runnerName,
      win,
      lose,
      settled: runner.status === 'WINNER' ? win : lose,
      result: runner.status === 'WINNER',
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
                    const isBetOnSelection = column.id === 'win' || column.id === 'lose' || column.id === 'settled';
                    const color = isBetOnSelection ? (parseFloat(value) < 0 ? 'red' : 'green') : 'black';
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'result' ? (
                          <span
                            className={clsx(classes.marketOutcome, {
                              [row.result]: classes.selectionWin,
                              [!row.result]: classes.selectionLose,
                            })}
                          >
                            {row.result ? 'Won' : 'Lost'}
                          </span>
                        ) : null}
                        <span style={{ color, fontWeight: isBetOnSelection ? 'bold' : 'normal' }}>{column.format && typeof value === 'number' ? column.format(value) : value}</span>
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
