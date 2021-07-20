import React from 'react';
import { connect } from 'react-redux';
import uuid from 'react-uuid';
import clsx from 'clsx';
//* @material-ui core
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
//* JSS
import useStyles from '../../../jss/components/ClosedMarketView/marketReportStyle';
//* Data
import { columns, createRows } from '../../../data/tables/marketReportTable';

const MarketReport = ({ matchedBets, runners, runnerResults }) => {
  const classes = useStyles();
  const rows = createRows(runners, runnerResults, matchedBets);

  return (
    <div className={classes.marketReport}>
      <Typography component="h1" variant="h2" className={classes.title}>
        Closed Market Report
      </Typography>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader className={classes.reportTable}>
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
              <TableRow hover key={`market-report-row-${uuid()}`}>
                {columns.map(({ title, align }) => {
                  const data = row[title];
                  const isBetCol = title === 'win' || title === 'lose' || title === 'settled';
                  return (
                    <TableCell key={`market-report-cell-${title}-${uuid()}`} align={align}>
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
                      <span
                        className={clsx({
                          [classes.hasBets]: isBetCol,
                          [classes.selectionBetsProfit]: isBetCol && parseFloat(data) > 0,
                          [classes.selectionBetsLoss]: isBetCol && parseFloat(data) < 0,
                        })}
                      >
                        {data}
                      </span>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  priceType: state.ladder.priceType,
  matchedBets: state.order.bets.matched,
  runners: state.market.runners,
  runnerResults: state.market.runnerResults,
});

export default connect(mapStateToProps)(MarketReport);
