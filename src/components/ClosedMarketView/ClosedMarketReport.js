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
      overflowX: 'hidden'
    },
});

const columns = [
    { id: 'selection', label: 'Selection', minWidth: 170 },
    { id: 'win', label: 'If Win', minWidth: 75 },
    { id: 'lose', label: 'If Lose', minWidth: 75 },
    { id: 'settled', label: 'Settled', minWidth: 75 },
    { id: 'result', label: 'Result', minWidth: 50 },
];

export default () => {

    function createData(selection, win, lose, settled, result) {
        return { selection, win, lose, settled, result };
    }
    
    const rows = [];

    const classes = useStyles();

    return (
        <div style={{width: '49%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <div style={{height: '10%', backgroundColor: 'rgb(103, 128, 159)', color: 'white', paddingLeft: '2%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: '1.3em', fontWeight: 'bold'}}>
                        Closed Market Report
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
                                            return (
                                            <TableCell key={column.id} align={column.align}>
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