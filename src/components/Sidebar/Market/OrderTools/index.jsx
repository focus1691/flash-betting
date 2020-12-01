import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
//* Actions
import { setBackSelected } from '../../../../actions/back';
import { setFillOrKillSelected } from '../../../../actions/fillOrKill';
import { setLaySelected } from '../../../../actions/lay';
import { setStopEntrySelected } from '../../../../actions/stopEntry';
import { setStopLossSelected } from '../../../../actions/stopLoss';
import { setTickOffsetSelected } from '../../../../actions/tickOffset';
import Back from './Back';
import FillOrKill from './FillOrKill';
import Lay from './Lay';
import StopEntry from './StopEntry';
import StopLoss from './StopLoss';
import TickOffset from './TickOffset';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    border: 0,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

function createData(name, abbreviation, description, settings, isOpen, toggleExpand, selected, toggleSelected) {
  return {
    name,
    abbreviation,
    description,
    settings,
    isOpen,
    toggleExpand,
    selected,
    toggleSelected,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  table: {},
}));

const OrderTools = ({
  backText,
  backSelected,
  layText,
  laySelected,
  stopLossText,
  stopLossSelected,
  tickOffsetText,
  tickOffsetSelected,
  fillKillText,
  fillKillSelected,
  stopEntrySelected,
  setBackSelected,
  setLaySelected,
  setStopLossSelected,
  setTickOffsetSelected,
  setFillOrKillSelected,
  setStopEntrySelected,
}) => {
  const classes = useStyles();

  const [stopLoss, toggleStopLoss] = useState(false);
  const [tickOffset, toggleTickOffset] = useState(false);
  const [back, toggleBack] = useState(false);
  const [lay, toggleLay] = useState(false);
  const [fillOrKill, toggleFillOrKill] = useState(false);
  const [stopEntry, toggleStopEntry] = useState(false);

  const rows = useMemo(
    () => [
      createData('Back', 'B', backText, <Back />, back, toggleBack, backSelected, setBackSelected),
      createData('Lay', 'L', layText, <Lay />, lay, toggleLay, laySelected, setLaySelected),
      createData('Stop Loss', 'SL', stopLossText, <StopLoss />, stopLoss, toggleStopLoss, stopLossSelected, setStopLossSelected),
      createData('Tick Offset', 'TO', tickOffsetText, <TickOffset />, tickOffset, toggleTickOffset, tickOffsetSelected, setTickOffsetSelected),
      createData('Fill or Kill', 'FOK', fillKillText, <FillOrKill />, fillOrKill, toggleFillOrKill, fillKillSelected, setFillOrKillSelected),
      createData('Stop Entry', 'SE', '', <StopEntry />, stopEntry, toggleStopEntry, stopEntrySelected, setStopEntrySelected),
    ],
    [
      back,
      backSelected,
      backText,
      fillKillSelected,
      fillKillText,
      fillOrKill,
      lay,
      laySelected,
      layText,
      setBackSelected,
      setFillOrKillSelected,
      setLaySelected,
      setStopEntrySelected,
      setStopLossSelected,
      setTickOffsetSelected,
      stopEntry,
      stopEntrySelected,
      stopLoss,
      stopLossSelected,
      stopLossText,
      tickOffset,
      tickOffsetSelected,
      tickOffsetText,
    ],
  );

  return (
    <Paper className={classes.root}>
      <Table className={`${classes.table} order-settings-tbl`}>
        <TableBody>
          {rows.map(({ name, description, isOpen, selected, toggleSelected, toggleExpand, settings }) => (
            <React.Fragment key={`tool-${name}`}>
              <StyledTableRow>
                <StyledTableCell scope="row" colSpan={4}>
                  <button type="button" className="order-btn" onClick={() => toggleExpand(!isOpen)}>
                    <div className="box">
                      <img alt="Add" src={`${window.location.origin}/icons/add-button-inside-black-circle.png`} />
                      <span>{name}</span>
                    </div>
                  </button>
                </StyledTableCell>
                <StyledTableCell align="left" colSpan={6}>
                  {description}
                </StyledTableCell>
                <StyledTableCell padding="checkbox" colSpan={2}>
                  <Checkbox color="primary" checked={selected} onChange={() => toggleSelected()} />
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <Collapse component="td" hidden={!isOpen} in={isOpen}>
                  <StyledTableCell scope="row" colSpan={12}>
                    {settings}
                  </StyledTableCell>
                </Collapse>
              </StyledTableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  // Back
  backText: state.back.text,
  backSelected: state.back.selected,
  // Lay
  layText: state.lay.text,
  laySelected: state.lay.selected,
  // Stop loss
  stopLossText: state.stopLoss.text,
  stopLossSelected: state.stopLoss.selected,
  // Tick Offset
  tickOffsetText: state.tickOffset.text,
  tickOffsetSelected: state.tickOffset.selected,
  // Fill or Kill
  fillKillText: state.fillOrKill.text,
  fillKillSelected: state.fillOrKill.selected,
  // Stop Entry
  stopEntrySelected: state.stopEntry.selected,
});

const mapDispatchToProps = {
  setBackSelected,
  setLaySelected,
  setStopLossSelected,
  setTickOffsetSelected,
  setFillOrKillSelected,
  setStopEntrySelected,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderTools);
