import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getPLForRunner, getLossForRunner } from '../../utils/Bets/GetProfitAndLoss';

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    tableWrapper: {
      maxHeight: '55vh',
      overflowX: 'auto'
    },
});

const columns = [
    { id: 'selection', label: 'Selection', minWidth: 170 },
    { id: 'win', label: 'If Win', minWidth: 75, },
    { id: 'lose', label: 'If Lose', minWidth: 75 },
    { id: 'settled', label: 'Settled', minWidth: 75 },
    { id: 'result', label: 'Result', minWidth: 50 },
];

export default ({matchedBets, runners}) => {

    function createData(selection, win, lose, settled, result) {
        return { selection, win, lose, settled, result };
    }

    const selectionWithBets = {};

    matchedBets.map(bet => {
        bet.price = bet.averagePriceMatched;
        bet.size = bet.sizeMatched;
        bet.marketId = runners.marketId;
        if (selectionWithBets[bet.selectionId]) selectionWithBets[bet.selectionId].push(bet)
        else selectionWithBets[bet.selectionId] = [bet]
    })
    
    const rows = runners.map(runner => {
        const win = matchedBets !== undefined ? getPLForRunner(runners.marketId, runner.selectionId, {matched: matchedBets}).toFixed(2): 0
        const lose = matchedBets !== undefined ? getLossForRunner(runners.marketId, runner.selectionId, {matched: matchedBets}).toFixed(2): 0; //placeholder
        return {
            selection: runner.runnerName,
            win: win,
            lose: lose,
            settled: runner.status === "WINNER" ? win : lose,
            result: runner.status === "WINNER"
        }
    });

    const classes = useStyles();

    return (
        <div className = {'marketstats-table-container'}>
                    <div style={{height: '6vh', backgroundColor: 'rgb(103, 128, 159)', color: 'white', paddingLeft: '2%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: '1.3em', fontWeight: 'bold'}}>
                        Closed Market Report
                    </div>
                    <Paper className={classes.root} style={{height: '90%'}}>
                        <div className={classes.tableWrapper + " marketstats-table-wrapper"}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                        >
                                        {column.label}
                                        </TableCell>
                                    ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map(column => {
                                            const value = row[column.id];
                                            const isProfitOrLoss = column.id === "win" || column.id === "lose" || column.id === "settled" 
                                            const color = isProfitOrLoss ? parseFloat(value) < 0 ? 'red' : 'green' : 'black'
                                            return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.id === "result" ? 
                                                    <span className = {"marketstats-table-win-result"} style={{backgroundColor: row.result ? 'rgb(37, 194, 129)' : 'rgb(237, 107, 117)'}}>
                                                        {row.result ? "Won" : "Lost"}
                                                    </span> : null}
                                                <span style={{color: color, fontWeight: isProfitOrLoss ? 'bold' : 'normal'}}>{column.format && typeof value === 'number' ? column.format(value) : value}</span>
                                            </TableCell>
                                            );
                                        })}
                                        </TableRow>
                                    );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Paper>
                </div>
    )
}