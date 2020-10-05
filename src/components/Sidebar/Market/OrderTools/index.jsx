import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import React, { useState } from 'react';
import { connect } from 'react-redux';
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  table: {},
}));

const OrderTools = (props) => {
  const classes = useStyles();

  const [stopLoss, toggleStopLoss] = useState(false);
  const [tickOffset, toggleTickOffset] = useState(false);
  const [back, toggleBack] = useState(false);
  const [lay, toggleLay] = useState(false);
  const [fillOrKill, toggleFillOrKill] = useState(false);
  const [stopEntry, toggleStopEntry] = useState(false);

  const rows = [
    createData('Stop Loss', 'SL', props.stopLossText, <StopLoss />, stopLoss, toggleStopLoss, props.stopLossSelected, props.onStopLossSelection),
    createData('Tick Offset', 'TO', props.tickOffsetText, <TickOffset />, tickOffset, toggleTickOffset, props.tickOffsetSelected, props.onTickOffsetSelection),
    createData('Back', 'B', props.backText, <Back />, back, toggleBack, props.backSelected, props.onBackSelection),
    createData('Lay', 'L', props.layText, <Lay />, lay, toggleLay, props.laySelected, props.onLaySelection),
    createData('Fill or Kill', 'FOK', props.fillKillText, <FillOrKill />, fillOrKill, toggleFillOrKill, props.setFillOrKillSelected, props.onFillOrKillSelection),
    createData('Stop Entry', 'SE', '', <StopEntry />, stopEntry, toggleStopEntry, props.setStopEntrySelected, props.onStopEntrySelection),
  ];

  return (
    <Paper className={classes.root}>
      <Table className={`${classes.table} order-settings-tbl`}>
        <TableBody>
          {rows.map((row) => (
            <React.Fragment key={`tool-${row.name}`}>
              <StyledTableRow>
                <StyledTableCell scope="row" colSpan={4}>
                  <button className={'order-btn'} onClick={(e) => row.toggleExpand(!row.isOpen)}>
                    <div className={'box'}>
                      <img alt={'Add'} src={window.location.origin + '/icons/add-button-inside-black-circle.png'} />
                      <span>{row.name}</span>
                    </div>
                  </button>
                </StyledTableCell>
                <StyledTableCell align="left" colSpan={6}>
                  {row.description}
                </StyledTableCell>
                <StyledTableCell padding="checkbox" colSpan={2}>
                  <Checkbox
                    color="primary"
                    checked={row.selected}
                    onChange={(e) => {
                      row.toggleSelected();
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <Collapse hidden={!row.isOpen} in={row.isOpen}>
                  <StyledTableCell scope="row" colSpan={12}>
                    {row.settings}
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
  // Stop loss
  stopLossText: state.stopLoss.text,
  stopLossSelected: state.stopLoss.selected,
  // Tick Offset
  tickOffsetText: state.tickOffset.text,
  tickOffsetSelected: state.tickOffset.selected,
  // Back
  backText: state.back.text,
  backSelected: state.back.selected,
  // Lay
  layText: state.lay.text,
  laySelected: state.lay.selected,
  // Fill or Kill
  fillKillText: state.fillOrKill.text,
  fillKillSelected: state.fillOrKill.selected,
  // Stop Entry
  stopEntrySelected: state.stopEntry.selected,
});

const mapDispatchToProps = (dispatch) => ({
  onStopEntrySelection: (selection) => dispatch(setStopEntrySelected(null)),
  onStopLossSelection: (selection) => dispatch(setStopLossSelected(null)),
  onTickOffsetSelection: (selection) => dispatch(setTickOffsetSelected(null)),
  onBackSelection: (selection) => dispatch(setBackSelected(null)),
  onLaySelection: (selection) => dispatch(setLaySelected(null)),
  onFillOrKillSelection: (selection) => dispatch(setFillOrKillSelected(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderTools);
