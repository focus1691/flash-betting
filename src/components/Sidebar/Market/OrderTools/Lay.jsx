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
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/lay';
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

const Lay = ({
  stake, price, hours, minutes, seconds, executionTime, marketId, runners, selections, list,
  onTextUpdate, onReceiveStake, onReceivePrice, onReceiveHours, onReceiveMinutes, onReceiveSeconds,
  onToggleExecutionTime, onSelection, onUpdateLayList,
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

    const newLayList = { ...list };

    await Promise.all(selectedRunners.map(async (selection) => {
      const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);
      const convertedSelection = parseInt(selection);
      const addedOrder = {
        strategy: 'Lay',
        marketId,
        selectionId: convertedSelection,
        executionTime,
        timeOffset: (hours * 3600) + (minutes * 60) + parseInt(seconds),
        size: stake,
        price: formatPrice(price),
        rfs: referenceStrategyId,
      };

      // make sure request is processed before saving it

      await fetch('/api/save-bet', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(addedOrder),
      }).then(() => {
        if (newLayList[convertedSelection] === undefined) {
          newLayList[convertedSelection] = [addedOrder];
        } else {
          newLayList[convertedSelection] = newLayList[convertedSelection].concat(addedOrder);
        }
      });
    }));
    onUpdateLayList(newLayList);
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
            primary="Lay"
            secondary={
              selections
                ? typeof selections === 'string'
                  ? runners[selections].runnerName
                  : 'Lay All / The Field'
                : ''
            }
          />
        </ListItem>
      </List>
      <StyledMenu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* The Menu Item for Back All / the Field */}
        {runners ? (
          <StyledMenuItem
            key="lay-order-all/field"
            className={classes.root}
            selected={typeof selections !== 'string'}
            onClick={handleMenuItemClick(Object.keys(runners).map((key) => [runners[key].selectionId]))}
          >
            Lay All / The Field
          </StyledMenuItem>
        ) : null}

        {/* Create Menu Items for all the runners and display their names
         * Store their selectionId to be used to place bets for event clicks
         */}
        {Object.keys(runners).map((key) => (
          <StyledMenuItem
            key={`lay-order-${runners[key].runnerName}`}
            className={classes.root}
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
          onChange={(e) => onReceiveStake(e.target.value)}
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
        <Button variant="outlined" color="primary" className={classes.button} onClick={placeOrder()}>
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
          onChange={(e) => onReceiveHours(e.target.value)}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField2}
          type="number"
          label="mm"
          value={minutes}
          inputProps={{ min: '0', max: '59', style: { fontSize: 10 } }}
          onChange={(e) => onReceiveMinutes(e.target.value)}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField2}
          type="number"
          label="ss"
          value={seconds}
          inputProps={{ min: '0', max: '59', style: { fontSize: 10 } }}
          onChange={(e) => onReceiveSeconds(e.target.value)}
          margin="normal"
        />

        <RadioGroup
          aria-label="orderexecution"
          name="orderexecution"
          value={executionTime}
          onChange={(e) => onToggleExecutionTime(e.target.value)}
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

const mapDispatchToProps = (dispatch) => ({
  onTextUpdate: (text) => dispatch(actions.setDisplayText(text)),
  onReceiveStake: (stake) => dispatch(actions.setStake(stake)),
  onReceivePrice: (price) => dispatch(actions.setPrice(price)),
  onReceiveHours: (hours) => dispatch(actions.setHours(hours)),
  onReceiveMinutes: (minutes) => dispatch(actions.setMinutes(minutes)),
  onReceiveSeconds: (seconds) => dispatch(actions.setSeconds(seconds)),
  onToggleExecutionTime: (time) => dispatch(actions.toggleExecutionTime(time)),
  onSelection: (selections) => dispatch(actions.setSelections(selections)),
  onUpdateLayList: (list) => dispatch(actions.updateLayList(list)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Lay);
