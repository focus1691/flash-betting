import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
//* JSS
import useStyles from '../../../../jss/components/Sidebar/market/tools';
import { ToolsTableCell, ToolsTableRow } from '../../../../jss/components/Sidebar/market/tools/toolsTableStyle';
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

const Tools = ({
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
      createData('SL', 'SL', stopLossText, <StopLoss />, stopLoss, toggleStopLoss, stopLossSelected, setStopLossSelected),
      createData('TOS', 'TO', tickOffsetText, <TickOffset />, tickOffset, toggleTickOffset, tickOffsetSelected, setTickOffsetSelected),
      createData('FOK', 'FOK', fillKillText, <FillOrKill />, fillOrKill, toggleFillOrKill, fillKillSelected, setFillOrKillSelected),
      createData('SE', 'SE', '', <StopEntry />, stopEntry, toggleStopEntry, stopEntrySelected, setStopEntrySelected),
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
    <div className={classes.root}>
      <Table className={classes.table}>
        <TableBody>
          {rows.map(({ name, description, isOpen, selected, toggleSelected, toggleExpand, settings }) => (
            <React.Fragment key={`tool-${name}`}>
              <ToolsTableRow>
                <ToolsTableCell scope="row" colSpan={5}>
                  <button type="button" className={classes.betButton} onClick={() => toggleExpand(!isOpen)}>
                    <div className={classes.box}>
                      <img alt="Add" src={`${window.location.origin}/icons/Plus_Button.svg`} />
                      <span>{name}</span>
                    </div>
                  </button>
                </ToolsTableCell>
                <ToolsTableCell align="left" colSpan={6}>
                  {description}
                </ToolsTableCell>
                <ToolsTableCell padding="checkbox" colSpan={1}>
                  <Checkbox color="primary" checked={selected} onChange={() => toggleSelected()} />
                </ToolsTableCell>
              </ToolsTableRow>

              <ToolsTableRow>
                <Collapse component="td" hidden={!isOpen} in={isOpen}>
                  <ToolsTableCell scope="row" colSpan={12}>
                    {settings}
                  </ToolsTableCell>
                </Collapse>
              </ToolsTableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Tools);
