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
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
//* Actions
import { setDisplayText, setStake, setPrice, setHours, setMinutes, setSeconds, toggleExecutionTime, setSelections, updateBackList } from '../../../../actions/back';
import { formatPrice, findPriceStep } from '../../../../utils/ladder/CreateFullLadder';
//* JSS
import StyledMenu from '../../../../jss/StyledMenu';
import StyledMenuItem from '../../../../jss/StyledMenuItem';
import dropdownRunnerStyle from '../../../../jss/DropdownList';
//* HTTP
import { saveBet } from '../../../../http/dbHelper';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2),
  },
  textField: {
    width: 40,
    margin: theme.spacing(1),
  },
  textField2: {
    width: 30,
    margin: theme.spacing(2),
  },
  ...dropdownRunnerStyle(theme),
}));

const Back = ({ stake, price, hours, minutes, seconds, executionTime, marketId, runners, selections, list, setDisplayText, setStake, setPrice, setHours, setMinutes, setSeconds, toggleExecutionTime, setSelections, updateBackList }) => {
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

  const handleClickListItem = () => (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuItemClick = (index) => (e) => {
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
  const placeOrder = () => async () => {
    const selectedRunners = typeof selections === 'string' ? [selections] : selections;

    const newBackList = { ...list };

    await Promise.all(
      selectedRunners.map(async (selectionId) => {
        const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
        const addedOrder = {
          strategy: 'Back',
          marketId,
          selectionId,
          executionTime,
          timeOffset: hours * 3600 + minutes * 60 + seconds,
          size: stake,
          price: formatPrice(price),
          rfs: customerStrategyRef,
        };

        saveBet(addedOrder);

        if (!newBackList[selectionId]) {
          newBackList[selectionId] = [addedOrder];
        } else {
          newBackList[selectionId] = newBackList[selectionId].concat(addedOrder);
        }
      }),
    );
    updateBackList(newBackList);
  };

  return (
    <>
      <List component="nav" aria-label="Device settings">
        <ListItem button aria-haspopup="true" aria-controls="lock-menu" aria-label="Selections" onClick={handleClickListItem()}>
          <ListItemText primary="Back" secondary={selections ? (typeof selections === 'string' ? runners[selections].runnerName : 'Back All / The Field') : ''} />
        </ListItem>
      </List>
      <StyledMenu id="lock-menu" className={classes.runnerList} anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {/* The Menu Item for Back All / the Field */}
        {runners ? (
          <StyledMenuItem key="back-order-all/field" className={classes.runnerItem} selected={typeof selections !== 'string'} onClick={handleMenuItemClick(Object.keys(runners).map((key) => [runners[key].selectionId]))}>
            Back All / The Field
          </StyledMenuItem>
        ) : null}

        {/* Create Menu Items for all the runners and display their names
         * Store their selectionId to be used to place bets for event clicks
         */}
        {Object.keys(runners).map((key) => (
          <StyledMenuItem key={`back-order-${runners[key].runnerName}`} className={classes.runnerItem} selected={key === selections} onClick={handleMenuItemClick(key)}>
            {runners[key].runnerName}
          </StyledMenuItem>
        ))}
      </StyledMenu>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TextField id="standard-number" className={classes.textField} type="number" label="stake" value={stake} inputProps={{ min: '1', style: { fontSize: 10 } }} onChange={(e) => setStake(e.target.value)} margin="normal" />
        <TextField
          id="standard-number"
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
        <Button variant="outlined" color="primary" size="small" className={classes.button} onClick={placeOrder()}>
          Submit
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TextField id="standard-number" className={classes.textField2} type="number" label="hh" value={hours} inputProps={{ min: '0', style: { fontSize: 10 } }} onChange={() => setHours()} margin="normal" />
        <TextField id="standard-number" className={classes.textField2} type="number" label="mm" value={minutes} inputProps={{ min: '0', max: '59', style: { fontSize: 10 } }} onChange={() => setMinutes()} margin="normal" />
        <TextField id="standard-number" className={classes.textField2} type="number" label="ss" value={seconds} inputProps={{ min: '0', max: '59', style: { fontSize: 10 } }} onChange={() => setSeconds()} margin="normal" />

        <RadioGroup aria-label="orderexecution" name="orderexecution" value={executionTime} onChange={() => toggleExecutionTime()}>
          <FormControlLabel value="Before" className={classes.formControlLabel} control={<Radio color="primary" />} label={<span>-</span>} />

          <FormControlLabel value="After" control={<Radio color="primary" />} label="+" />
        </RadioGroup>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  stake: state.back.stake,
  price: state.back.price,
  hours: state.back.offset.hours,
  minutes: state.back.offset.minutes,
  seconds: state.back.offset.seconds,
  executionTime: state.back.executionTime,
  marketId: state.market.marketId,
  runners: state.market.runners,
  selections: state.back.selections,
  list: state.back.list,
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
  updateBackList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Back);
