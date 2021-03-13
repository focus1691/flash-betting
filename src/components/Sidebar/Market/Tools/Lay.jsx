import _ from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import crypto from 'crypto';
//* @material-ui core
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
//* Actions
import { setDisplayText, setStake, setPrice, setHours, setMinutes, setSeconds, toggleExecutionTime, setSelections, updateLayList } from '../../../../actions/lay';
//* Utils
import { formatPrice, findPriceStep } from '../../../../utils/Bets/PriceCalculations';
//* JSS
import useStyles from '../../../../jss/components/Sidebar/market/tools/backLayStyle';
import StyledMenu from '../../../../jss/StyledMenu';
import StyledMenuItem from '../../../../jss/StyledMenuItem';
//* HTTP
import { saveBet } from '../../../../http/dbHelper';

const Lay = ({ stake, price, hours, minutes, seconds, executionTime, marketId, runners, selections, list, setDisplayText, setStake, setPrice, setHours, setMinutes, setSeconds, toggleExecutionTime, setSelections, updateLayList }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [step, setStep] = useState(findPriceStep(price));

  // Change the text when the fields change
  useEffect(() => {
    setDisplayText(`${stake} @ ${price}`);
  }, [setDisplayText, price, stake]);

  // Load all the runners / set All / The Field as the default
  useEffect(() => {
    setSelections(Object.keys(runners).map((key) => [runners[key].selectionId]));
  }, [setSelections, runners]);

  const handleClickListItem = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuItemClick = (index) => () => {
    setSelections(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateStep = useCallback(
    (e) => {
      const v = e.target.value;

      // Set empty String for non-numbers
      if (isNaN(parseInt(v))) {
        setPrice('');
        return;
      }
      if (price === '' && parseInt(v) === 1) {
        setStep(0.01);
        setPrice(1.01);
        return;
      }

      const newStep = findPriceStep(v);

      if (newStep !== step) {
        setStep(newStep);
      }

      setPrice(v);
    },
    [price, step, setPrice],
  );

  // Handle Submit click to place an order
  const placeOrder = async () => {
    if (!_.isEmpty(selections)) {
      const selectedRunners = typeof selections === 'string' ? [selections] : selections;

      const newLayList = { ...list };

      await Promise.all(
        selectedRunners.map(async (selectionId) => {
          const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
          const addedOrder = {
            strategy: 'Lay',
            marketId,
            selectionId,
            executionTime,
            timeOffset: hours * 3600 + minutes * 60 + seconds,
            size: stake,
            price: formatPrice(price),
            rfs: customerStrategyRef,
          };
          saveBet(addedOrder);

          if (!newLayList[selectionId]) {
            newLayList[selectionId] = [addedOrder];
          } else {
            newLayList[selectionId] = newLayList[selectionId].concat(addedOrder);
          }
        }),
      );
      updateLayList(newLayList);
    }
  };

  return (
    <>
      <List component="nav">
        <ListItem button aria-haspopup="true" aria-controls="lock-menu" onClick={handleClickListItem}>
          <ListItemText primary="Selections to lay" secondary={selections ? (typeof selections === 'string' ? runners[selections].runnerName : 'Lay All / The Field') : ''} className={classes.selectedRunner} />
        </ListItem>
      </List>
      <StyledMenu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {/* The Menu Item for Back All / the Field */}
        {runners ? (
          <StyledMenuItem key="lay-order-all/field" className={classes.root} selected={typeof selections !== 'string'} onClick={handleMenuItemClick(Object.keys(runners).map((key) => [runners[key].selectionId]))}>
            Lay All / The Field
          </StyledMenuItem>
        ) : null}

        {/* Create Menu Items for all the runners and display their names
         * Store their selectionId to be used to place bets for event clicks
         */}
        {Object.keys(runners).map((key) => (
          <StyledMenuItem key={`lay-order-${runners[key].runnerName}`} className={classes.root} selected={key === selections} onClick={handleMenuItemClick(key)}>
            {runners[key].runnerName}
          </StyledMenuItem>
        ))}
      </StyledMenu>
      <div className={classes.row}>
        <TextField className={classes.textField} type="number" label="stake" value={stake} inputProps={{ min: '1', style: { fontSize: 10 } }} onChange={(e) => setStake(e.target.value)} margin="normal" />
        <TextField
          className={classes.textField}
          type="number"
          label="@"
          value={price}
          inputProps={{
            min: '1.00',
            max: '1000',
            step,
            style: { fontSize: 10 },
          }}
          onChange={updateStep}
          margin="normal"
        />
        <Button variant="outlined" color="primary" className={classes.button} onClick={placeOrder}>
          Submit
        </Button>
      </div>

      <div className={classes.row}>
        <TextField className={classes.textField} type="number" label="hh" value={hours} inputProps={{ min: '0', style: { fontSize: 10 } }} onChange={(e) => setHours(e.target.value)} margin="normal" />
        <TextField className={classes.textField} type="number" label="mm" value={minutes} inputProps={{ min: '0', max: '59', style: { fontSize: 10 } }} onChange={(e) => setMinutes(e.target.value)} margin="normal" />
        <TextField className={classes.textField} type="number" label="ss" value={seconds} inputProps={{ min: '0', max: '59', style: { fontSize: 10 } }} onChange={(e) => setSeconds(e.target.value)} margin="normal" />
      </div>
      <div className={classes.row}>
        <RadioGroup name="orderexecution" value={executionTime} onChange={(e) => toggleExecutionTime(e.target.value)} className={classes.marketTimeRadioButtons}>
          <FormControlLabel value="Before" className={classes.formControlLabel} control={<Radio color="primary" />} label={<span>Before market open</span>} />
          <FormControlLabel value="After" className={classes.formControlLabel} control={<Radio color="primary" />} label="After market open" />
        </RadioGroup>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  stake: state.lay.stake,
  price: state.lay.price,
  hours: state.lay.offset.hours,
  minutes: state.lay.offset.minutes,
  seconds: state.lay.offset.seconds,
  executionTime: state.lay.executionTime,
  runners: state.market.runners,
  selections: state.lay.selections,
  list: state.lay.list,
});

const mapDispatchToProps = {
  setDisplayText,
  setStake,
  setPrice,
  setHours,
  setMinutes,
  setSeconds,
  toggleExecutionTime,
  setSelections,
  updateLayList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Lay);
