import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    border: 0,
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

function createData(name, setting, third) {
  return { name, setting, third };
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
    // overflowX: 'auto',
  },
  table: {
    // minWidth: 100,
  },
}));

const Tools = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={`${classes.table} order-settings-tbl`}>
        <TableBody>
          {rows.map(row => (
            <StyledTableRow key={row.name}>
              <StyledTableCell scope="row">
                <button className={"order-btn"} onClick={e => console.log("order button clicked")}>
                  <div className={"box"}>
                    <img alt={"Add"} src={window.location.origin + '/icons/add-button-inside-black-circle.png'}/>
                    <span>{row.name}</span>
                  </div>
                </button>
              </StyledTableCell>
              <StyledTableCell align="left">{row.setting}</StyledTableCell>
              <StyledTableCell padding="checkbox">
                        <Checkbox
                          // checked={isItemSelected}
                          // inputProps={{ 'aria-labelledby': labelId }}
                        />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default Tools;