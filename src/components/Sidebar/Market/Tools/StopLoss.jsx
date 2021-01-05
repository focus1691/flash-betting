import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
//* Actions
import { setDisplayText, setStopLossOffset, setStopLossUnit, toggleStopLossTrailing, toggleStopLossHedged, setSelections } from '../../../../actions/stopLoss';
//* JSS
import useStyles from '../../../../jss/components/Sidebar/market/tools/stopLossStyle';
import StyledMenu from '../../../../jss/StyledMenu';
import StyledMenuItem from '../../../../jss/StyledMenuItem';

const StopLoss = ({ offset, units, trailing, hedged, runners, selections, setDisplayText, setStopLossOffset, setStopLossUnit, toggleStopLossTrailing, toggleStopLossHedged, setSelections }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  // Change the text when the fields change
  useEffect(() => {
    const box1Val = trailing ? 'x' : '-';
    const box2Val = hedged ? 'x' : '-';
    const unit = units === 'Percent' ? '(%)' : units;

    setDisplayText(`${offset} ${unit} [${box1Val}][${box2Val}]`);
  }, [offset, units, hedged, trailing, setDisplayText]);

  // Load all the runners / set All / The Field as the default
  useEffect(() => {
    setSelections(Object.keys(runners).map((key) => [runners[key].selectionId]));
  }, []);

  const handleClickListItem = () => (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuItemClick = (index) => () => {
    setSelections(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <List component="nav">
        <ListItem button aria-haspopup="true" aria-controls="lock-menu" onClick={handleClickListItem()}>
          <ListItemText primary="Runners" secondary={selections ? (typeof selections === 'string' ? runners[selections].runnerName : 'All / The Field') : ''} />
        </ListItem>
      </List>
      <StyledMenu id="lock-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {/* The Menu Item for All / the Field */}
        {runners ? (
          <StyledMenuItem key="stop-loss-order-all/field" className={classes.root} selected={typeof selections !== 'string'} onClick={handleMenuItemClick(Object.keys(runners).map((key) => [runners[key].selectionId]))}>
            All / The Field
          </StyledMenuItem>
        ) : null}
        {Object.keys(runners).map((key) => (
          <StyledMenuItem key={`stop-loss-order-${runners[key].runnerName}`} className={classes.root} selected={key === selections} onClick={handleMenuItemClick(key)}>
            {runners[key].runnerName}
          </StyledMenuItem>
        ))}
      </StyledMenu>

      <RadioGroup name="stoploss" className={classes.group} value={units} onChange={(e) => setStopLossUnit(e.target.value)}>
        <div className={classes.row}>
          <TextField id="standard-number" className={classes.textField} type="number" value={offset} inputProps={{ min: '1', max: '100' }} onChange={(e) => setStopLossOffset(e.target.value)} margin="normal" />
          <FormControlLabel value="Ticks" className={classes.formControlLabel} control={<Radio color="primary" />} label={<span>Tick</span>} />
          <FormControlLabel value="Percent" control={<Radio color="primary" />} label="%" />
        </div>
      </RadioGroup>
      <div className={classes.row}>
        <FormControlLabel control={<Checkbox color="primary" checked={trailing} onChange={(e) => toggleStopLossTrailing(e.target.checked)} />} label="Trailing" />
        <FormControlLabel control={<Checkbox color="primary" checked={hedged} onChange={(e) => toggleStopLossHedged(e.target.checked)} />} label="Hedged" />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  offset: state.stopLoss.offset,
  units: state.stopLoss.units,
  trailing: state.stopLoss.trailing,
  hedged: state.stopLoss.hedged,
  runners: state.market.runners,
  selections: state.stopLoss.selections,
});

const mapDispatchToProps = {
  setDisplayText,
  setStopLossOffset,
  setStopLossUnit,
  toggleStopLossTrailing,
  toggleStopLossHedged,
  setSelections,
};

export default connect(mapStateToProps, mapDispatchToProps)(StopLoss);
