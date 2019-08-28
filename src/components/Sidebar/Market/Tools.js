import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
  width: 100,
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

function createData(name, setting) {
  return { name, setting };
}

const rows = [
  createData('Stop Loss', '30 Ticks'),
  createData('Tick Offset', '3 Ticks (%) [x]'),
  createData('Back', '@ 1 [-][-][-]'),
  createData('Lay', '100 @ 4 [-][-][-]'),
  createData('Fill or Kill', '0 Seconds'),
  createData('Drip Feed', 'L //'),
  createData('OCO', ''),
  createData('Stop Entry', ''),
  createData('Chaser', 'Ticks / 0 sec'),
];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'hidden',
  },
  table: {
    minWidth: 100,
    // width: 10,
    // background: 'red',
  },
}));

const Tools = () => {
  const classes = useStyles();

  rows.map(row => {
    console.log(row);
  });

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableBody>
          {rows.map(row => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="left">{row.setting}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default Tools;