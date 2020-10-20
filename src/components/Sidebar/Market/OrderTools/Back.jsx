import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import crypto from 'crypto';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/back';
import { formatPrice, findPriceStep } from '../../../../utils/ladder/CreateFullLadder';
import StyledMenu from '../../../MaterialUI/StyledMenu';
import StyledMenuItem from '../../../MaterialUI/StyledMenuItem';
import dropdownRunnerStyle from '../../../../assets/jss/DropdownList';

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

const Back = ({
  stake, price, hours, minutes, seconds, executionTime, marketId, runners, selections, list,
  onTextUpdate, onReceiveStake, onReceivePrice, onReceiveHours, onReceiveMinutes, onReceiveSeconds,
  onToggleExecutionTime, onSelection, onUpdateBackList,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [step, setStep] = useState(findPriceStep(price));

  // Change the text when the fields change
  useEffect(() => {
    onTextUpdate(`${stake} @ ${price}`);
  }, [onTextUpdate, price, stake]);

  // Load all the runners / set All / The Field as the default
  useEffect(() => {
    onSelection((Object.keys(runners).map((key) => [
      runners[key].selectionId,
    ])));
  }, [onSelection, runners]);

  const handleClickListItem = () => (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuItemClick = (index) => (e) => {
    onSelection(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateStep = useCallback((e) => {
    const v = e.target.value;

    // Set empty String for non-numbers
    if (isNaN(parseInt(v))) {
      onReceivePrice('');
      return;
    } if (price === '' && parseInt(v) === 1) {
      setStep(0.01);
      onReceivePrice(1.01);
      return;
    }

    const newStep = findPriceStep(v);

    if (newStep !== step) {
      setStep(newStep);
    }

    onReceivePrice(v);
  }, [price, step, onReceivePrice]);

  // Handle Submit click to place an order
  const placeOrder = () => async (e) => {
    const selectedRunners = typeof selections === 'string' ? [selections] : selections;

    const newBackList = { ...list };

    await Promise.all(selectedRunners.map(async (selection, index) => {
      const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);
      const convertedSelection = parseInt(selection);
      const addedOrder = {
        strategy: 'Back',
        marketId,
        selectionId: convertedSelection,
        executionTime,
        timeOffset: (hours * 3600) + (minutes * 60) + parseInt(seconds),
        size: stake,
        price: formatPrice(price),
        rfs: referenceStrategyId,
      };

      // make sure request is processed before saving it
      await fetch('/api/save-order', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(addedOrder),
      }).then(() => {
        if (newBackList[convertedSelection] === undefined) {
          newBackList[convertedSelection] = [addedOrder];
        } else {
          newBackList[convertedSelection] = newBackList[convertedSelection].concat(addedOrder);
        }
      });
    }));
    onUpdateBackList(newBackList);
  };

  return (
    <>
      <List component="nav" aria-label="Device settings">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="Selections"
          onClick={handleClickListItem()}
        >
          <ListItemText
            primary="Back"
            secondary={
              selections
                ? typeof selections === 'string'
                  ? runners[selections].runnerName
                  : 'Back All / The Field'
                : ''
            }
          />
        </ListItem>
      </List>
      <StyledMenu
        id="lock-menu"
        className={classes.runnerList}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* The Menu Item for Back All / the Field */}
        {runners ? (
          <StyledMenuItem
            key="back-order-all/field"
            className={classes.runnerItem}
            selected={typeof selections !== 'string'}
            onClick={handleMenuItemClick(Object.keys(runners).map((key) => [runners[key].selectionId]))}
          >
            Back All / The Field
          </StyledMenuItem>
        ) : null}

        {/* Create Menu Items for all the runners and display their names
         * Store their selectionId to be used to place bets for event clicks
         */}
        {Object.keys(runners).map((key) => (
          <StyledMenuItem
            key={`back-order-${runners[key].runnerName}`}
            className={classes.runnerItem}
            selected={key === selections}
            onClick={handleMenuItemClick(key)}
          >
            {runners[key].runnerName}
          </StyledMenuItem>
        ))}
      </StyledMenu>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TextField
          id="standard-number"
          className={classes.textField}
          type="number"
          label="stake"
          value={stake}
          inputProps={{ min: '1', style: { fontSize: 10 } }}
          onChange={onReceiveStake()}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField}
          type="number"
          label="@"
          value={price}
          inputProps={{
            min: '1.00', max: '1000', step, style: { fontSize: 10 },
          }}
          onChange={updateStep}
          margin="normal"
        />
        <Button
          variant="outlined"
          color="primary"
          size="small"
          className={classes.button}
          onClick={placeOrder()}
        >
          Submit
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TextField
          id="standard-number"
          className={classes.textField2}
          type="number"
          label="hh"
          value={hours}
          inputProps={{ min: '0', style: { fontSize: 10 } }}
          onChange={onReceiveHours()}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField2}
          type="number"
          label="mm"
          value={minutes}
          inputProps={{ min: '0', max: '59', style: { fontSize: 10 } }}
          onChange={onReceiveMinutes()}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField2}
          type="number"
          label="ss"
          value={seconds}
          inputProps={{ min: '0', max: '59', style: { fontSize: 10 } }}
          onChange={onReceiveSeconds()}
          margin="normal"
        />

        <RadioGroup
          aria-label="orderexecution"
          name="orderexecution"
          value={executionTime}
          onChange={onToggleExecutionTime()}
        >
          <FormControlLabel
            value="Before"
            className={classes.formControlLabel}
            control={<Radio color="primary" />}
            label={<span>-</span>}
          />

          <FormControlLabel
            value="After"
            control={<Radio color="primary" />}
            label="+"
          />
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

const mapDispatchToProps = (dispatch) => ({
  onTextUpdate: (text) => dispatch(actions.setDisplayText(text)),
  onReceiveStake: () => (e) => dispatch(actions.setStake(e.target.value)),
  onReceivePrice: (price) => dispatch(actions.setPrice(price)),
  onReceiveHours: () => (e) => dispatch(actions.setHours(e.target.value)),
  onReceiveMinutes: () => (e) => dispatch(actions.setMinutes(e.target.value)),
  onReceiveSeconds: () => (e) => dispatch(actions.setSeconds(e.target.value)),
  onToggleExecutionTime: () => (e) => dispatch(actions.toggleExecutionTime(e.target.value)),
  onSelection: (selections) => dispatch(actions.setSelections(selections)),
  onUpdateBackList: (list) => dispatch(actions.updateBackList(list)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Back);
