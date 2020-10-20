import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import crypto from 'crypto';
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/stopEntry';
import { formatPrice, findPriceStep } from '../../../../utils/ladder/CreateFullLadder';
import StyledMenu from '../../../MaterialUI/StyledMenu';
import StyledMenuItem from '../../../MaterialUI/StyledMenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 75,
  },
  group: {
    margin: theme.spacing(1, 0),
  },
  formControlLabel: {
    fontSize: '0.6rem',
    '& label': {
      fontSize: '0.6rem',
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  backPriceTextFields: {
    width: 75,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  select: {
    margin: theme.spacing(1),
  },
}));

const StopEntry = ({
  marketId, runners, selections, price, stopEntryList, ticks, operator, side, stake, onUpdateStopEntryList, onSelection, onReceivePrice, onReceiveTicks, onReceiveStake, onReceiveOperator, 
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [step, setStep] = useState(findPriceStep(price));

  // Load all the runners / set All / The Field as the default
  useEffect(() => {
    onSelection(
      Object.keys(runners).map((key) => [runners[key].selectionId]),
    );
  }, []);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
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
  }, [step, price]);

  // Handle Submit click to place an order
  const placeOrder = () => async (e) => {
    const selections = typeof selections === 'string' ? [selections] : selections;

    const newStopEntryList = { ...stopEntryList };

    await Promise.all(selections.map(async (selection) => {
      const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);
      const convertedSelection = parseInt(selection);
      const addedOrder = {
        strategy: 'Stop Entry',
        marketId,
        selectionId: convertedSelection,
        targetLTP: ticks,
        stopEntryCondition: operator,
        side,
        size: stake,
        price: formatPrice(price),
        rfs: referenceStrategyId,
      };

      await fetch('/api/save-order', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(addedOrder),
      }).then(() => {
        if (newStopEntryList[convertedSelection] === undefined) {
          newStopEntryList[convertedSelection] = [addedOrder];
        } else {
          newStopEntryList[convertedSelection] = newStopEntryList[convertedSelection].concat(addedOrder);
        }
      });
    }));

    onUpdateStopEntryList(newStopEntryList);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Device settings">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="Selections"
          onClick={handleClickListItem}
        >
          <ListItemText
            primary="Runners"
            secondary={
              selections
                ? typeof selections === 'string'
                  ? runners[selections].runnerName
                  : 'All / The Field'
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
        {/* The Menu Item for All / the Field */}
        {runners ? (
          <StyledMenuItem
            key="stop-loss-order-all/field"
            className={classes.root}
            selected={typeof selections !== 'string'}
            onClick={handleMenuItemClick(Object.keys(runners).map((key) => [runners[key].selectionId]))}
          >
            All / The Field
          </StyledMenuItem>
        ) : null}
        {/* Create Menu Items for all the runners and display their names
         * Store their selectionId to be used to place bets for event clicks
         */}
        {Object.keys(runners).map((key) => (
          <StyledMenuItem
            key={`stop-entry-order-${runners[key].runnerName}`}
            className={classes.root}
            selected={key === selections}
            onClick={handleMenuItemClick(key)}
          >
            {runners[key].runnerName}
          </StyledMenuItem>
        ))}
      </StyledMenu>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>LTP</InputLabel>
          <Select
            native
            className={classes.select}
            value={operator}
            onChange={(e) => onReceiveOperator(e.target.value)}
            input={<OutlinedInput name="age" />}
          >
            <option value="" />
            <option value="<">{'<'}</option>
            <option value="=">=</option>
            <option value=">">{'>'}</option>
          </Select>
        </FormControl>
        <TextField
          id="standard-number"
          className={classes.textField}
          type="number"
          label="Ticks"
          value={ticks}
          inputProps={{ min: '1', max: '100' }}
          onChange={(e) => onReceiveTicks(e.target.value)}
          margin="normal"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TextField
          id="standard-number"
          className={classes.backPriceTextFields}
          type="number"
          label="Back"
          value={stake}
          inputProps={{ min: '1' }}
          onChange={(e) => onReceiveStake(e.target.value)}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.backPriceTextFields}
          type="number"
          label="@"
          value={price}
          inputProps={{ min: '1.00', max: '1000', step }}
          onChange={updateStep}
          margin="normal"
        />
      </div>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={placeOrder()}
      >
        Submit
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  operator: state.stopEntry.operator,
  ticks: state.stopEntry.ticks,
  stake: state.stopEntry.stake,
  price: state.stopEntry.price,
  side: state.stopEntry.side,
  stopEntryList: state.stopEntry.list,
  marketId: state.market.marketId,
  runners: state.market.runners,
  selections: state.stopEntry.selections,
});

const mapDispatchToProps = (dispatch) => ({
  onReceiveOperator: (operator) => dispatch(actions.setLTPOperator(operator)),
  onReceiveTicks: (ticks) => dispatch(actions.setTicks(ticks)),
  onReceiveStake: (stake) => dispatch(actions.setStake(stake)),
  onReceivePrice: (price) => dispatch(actions.setPrice(price)),
  onRecieveSide: (side) => dispatch(actions.setSide(side)),
  onUpdateStopEntryList: (list) => dispatch(actions.updateStopEntryList(list)),
  onSelection: (selections) => dispatch(actions.setSelections(selections)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StopEntry);
