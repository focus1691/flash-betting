import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import StopEntry from './StopEntry';
import StopLoss from './StopLoss';
import TickOffset from './TickOffset';
import Back from './Back';
import Lay from './Lay';
import FillOrKill from './FillOrKill';

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

function createData(name, description, settings, state, toggle) {
  return { name, description, settings, state, toggle };
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  table: {
  },
}));

const Tools = () => {
  const classes = useStyles();

  const [stopLoss, toggleStopLoss] = useState(false);
  const [tickOffset, toggleTickOffset] = useState(false);
  const [back, toggleBack] = useState(false);
  const [lay, toggleLay] = useState(false);
  const [fillOrKill, toggleFillOrKill] = useState(false);
  const [stopEntry, toggleStopEntry] = useState(false);

  const rows = [
    createData('Stop Loss', '30 Ticks', <StopLoss/>, stopLoss, toggleStopLoss),
    createData('Tick Offset', '3 Ticks (%) [x]', <TickOffset/>, tickOffset, toggleTickOffset),
    createData('Back', '@ 1 [-][-][-]', <Back/>, back, toggleBack),
    createData('Lay', '100 @ 4 [-][-][-]', <Lay/>, lay, toggleLay),
    createData('Fill or Kill', '0 Seconds', <FillOrKill/>, fillOrKill, toggleFillOrKill),
    createData('Stop Entry', '', <StopEntry/>, stopEntry, toggleStopEntry)
  ];

  return (
    <Paper className={classes.root}>
      <Table className={`${classes.table} order-settings-tbl`}>
        <TableBody>
          {rows.map(row => (
            <>
            <StyledTableRow key={row.name}>
              <StyledTableCell scope="row" colSpan={2}>
                <button className={"order-btn"} onClick={e =>row.toggle(!row.state)}>
                  <div className={"box"}>
                    <img alt={"Add"} src={window.location.origin + '/icons/add-button-inside-black-circle.png'}/>
                    <span>{row.name}</span>
                  </div>
                </button>
              </StyledTableCell>
              <StyledTableCell align="left" colSpan={3}>{row.description}</StyledTableCell>
              <StyledTableCell padding="checkbox" colSpan={1}>
                <Checkbox
                  // checked={isItemSelected}
                  // inputProps={{ 'aria-labelledby': labelId }}
                />
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow key={row.name} className={"order-editable"}>
              <Collapse hidden={!row.state} in={row.state}>
                <StyledTableCell colSpan={6}>{row.settings}</StyledTableCell>
              </Collapse>
          </StyledTableRow>
          </>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default Tools;