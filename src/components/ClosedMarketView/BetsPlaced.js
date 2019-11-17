import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
    { id: 'placedDate', label: 'Placed', minWidth: 75 },
    { id: 'selection', label: 'Selection', minWidth: 75 },
    { id: 'averagePriceMatched', label: 'Odds', minWidth: 75 },
    { id: 'sizeMatched', label: 'Stake / (Liability)', minWidth: 200 },
    { id: 'win', label: 'Status', minWidth: 75 },
];

export default ({matchedBets, runners = []}) => {

    const runnersObject = {};
    runners.map(runner => {
        runnersObject[runner.selectionId] = runner.runnerName
    })

    const sortedMatchedBets = matchedBets.sort((a, b) => Date.parse(b.placedDate) - Date.parse(a.placedDate));
    const matchedBetsAdjustments = sortedMatchedBets.map(bet => getStatus(getRunner(calculateNewPlacedDate(bet), runnersObject)))

    const rows = matchedBetsAdjustments

    const classes = useStyles();

    return (
        <div className = {'marketstats-table-container'}>
                    <div style={{height: '6vh', backgroundColor: 'rgb(103, 128, 159)', color: 'white', paddingLeft: '2%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: '1.3em', fontWeight: 'bold'}}>
                        Bets Placed
                    </div>
                    <Paper className={classes.root} style={{height: '90%'}}>
                        <div style={{height: '100%', border: 'solid 2px rgb(146, 164, 186)', borderTop: 'none'}} className={classes.tableWrapper}>
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
                                                const isSideBack = row.side === 'BACK'
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.id === "sizeMatched" ? 
                                                            <span className = {"marketstats-table-backlay-bet"} style={{backgroundColor: isSideBack ? 'rgb(114, 187, 239)' : 'rgb(250, 169, 186)'}}>
                                                                {(isSideBack ? "BACK" : "LAY")}
                                                            </span> : null}
                                                        {column.id === "win" ? <span className = {"marketstats-table-win-result"} style={{backgroundColor: column.win ? 'rgb(37, 194, 129)' : 'rgb(237, 107, 117)'}}>
                                                                                    {column.win ? "Won" : "Lost"}
                                                                                </span> : null}
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
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

const calculateNewPlacedDate = bet => {
    const betPlacedDate = new Date(bet.placedDate)
    const currentDate = new Date(Date.now()).getDate()
    const placedDate = betPlacedDate.getDate()

    const currentMonth = new Date(Date.now()).getMonth()
    const placedMonth = betPlacedDate.getMonth()

    const betPlacedOnDiffDay = currentMonth !== placedMonth || placedDate > currentDate || placedDate < currentDate 

    const newPlacedDate = betPlacedOnDiffDay ? 
                            betPlacedDate.toLocaleString('en-GB', {  hour12: false }) :
                            betPlacedDate.toLocaleTimeString(betPlacedDate, {  hour12: false })
                            
    return Object.assign({}, bet, {placedDate: newPlacedDate})
}

const getRunner = (bet, runners) => {
    return Object.assign({}, bet, {selection: runners[bet.selectionId]})
}

const getStatus = (bet, runners) => {
    if (runners) {
        return Object.assign({}, bet, {win: runners[bet.selectionId].status === "WINNER"})
    } else {
        return bet;
    }
}