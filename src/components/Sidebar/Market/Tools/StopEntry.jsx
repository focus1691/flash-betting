import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import crypto from 'crypto';
//* @material-ui core
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
//* Actions
import { setLTPOperator, setTicks, setStake, setPrice, updateStopEntryList, setSelections } from '../../../../actions/stopEntry';
import { formatPrice, findPriceStep } from '../../../../utils/ladder/CreateFullLadder';
//* JSS
import useStyles from '../../../../jss/components/Sidebar/market/tools/stopEntryStyle';
import StyledMenu from '../../../../jss/StyledMenu';
import StyledMenuItem from '../../../../jss/StyledMenuItem';
//* HTTP
import { saveBet } from '../../../../http/dbHelper';

const StopEntry = ({ marketId, runners, selections, price, stopEntryList, ticks, operator, side, stake, updateStopEntryList, setSelections, setPrice, setTicks, setStake, setLTPOperator }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [step, setStep] = useState(findPriceStep(price));

  // Load all the runners / set All / The Field as the default
  useEffect(() => {
    setSelections(Object.keys(runners).map((key) => [runners[key].selectionId]));
  }, []);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
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
  const placeOrder = () => async () => {
    const selectedRunners = typeof selections === 'string' ? [selections] : selections;

    const newStopEntryList = { ...stopEntryList };

    await Promise.all(
      selectedRunners.map(async (selectionId) => {
        const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);
        const addedOrder = {
          strategy: 'Stop Entry',
          marketId,
          selectionId,
          targetLTP: ticks,
          stopEntryCondition: operator,
          side,
          size: stake,
          price: formatPrice(price),
          rfs: referenceStrategyId,
        };
        saveBet(addedOrder);

        if (!newStopEntryList[selectionId]) {
          newStopEntryList[selectionId] = [addedOrder];
        } else {
          newStopEntryList[selectionId] = newStopEntryList[selectionId].concat(addedOrder);
        }
      }),
    );

    updateStopEntryList(newStopEntryList);
  };

  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem button onClick={handleClickListItem}>
          <ListItemText primary="Runners" secondary={selections ? (typeof selections === 'string' ? runners[selections].runnerName : 'All / The Field') : ''} />
        </ListItem>
      </List>
      <StyledMenu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {/* The Menu Item for All / the Field */}
        {runners ? (
          <StyledMenuItem key="stop-loss-order-all/field" className={classes.root} selected={typeof selections !== 'string'} onClick={handleMenuItemClick(Object.keys(runners).map((key) => [runners[key].selectionId]))}>
            All / The Field
          </StyledMenuItem>
        ) : null}
        {/* Create Menu Items for all the runners and display their names
         * Store their selectionId to be used to place bets for event clicks
         */}
        {Object.keys(runners).map((key) => (
          <StyledMenuItem key={`stop-entry-order-${runners[key].runnerName}`} className={classes.root} selected={key === selections} onClick={handleMenuItemClick(key)}>
            {runners[key].runnerName}
          </StyledMenuItem>
        ))}
      </StyledMenu>
      <div className={classes.row}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>LTP</InputLabel>
          <Select native className={classes.select} value={operator} onChange={(e) => setLTPOperator(e.target.value)} input={<OutlinedInput name="age" />}>
            <option value="" />
            <option value="<">{'<'}</option>
            <option value="=">=</option>
            <option value=">">{'>'}</option>
          </Select>
        </FormControl>
        <TextField className={classes.textField} type="number" label="Ticks" value={ticks} inputProps={{ min: '1', max: '100' }} onChange={(e) => setTicks(e.target.value)} margin="normal" />
      </div>
      <div className={classes.row}>
        <TextField className={classes.backPriceTextFields} type="number" label="Back" value={stake} inputProps={{ min: '1' }} onChange={(e) => setStake(e.target.value)} margin="normal" />
        <TextField className={classes.backPriceTextFields} type="number" label="@" value={price} inputProps={{ min: '1.00', max: '1000', step }} onChange={updateStep} margin="normal" />
      </div>
      <Button variant="outlined" className={classes.button} onClick={placeOrder()}>
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

const mapDispatchToProps = { setLTPOperator, setTicks, setStake, setPrice, updateStopEntryList, setSelections };

export default connect(mapStateToProps, mapDispatchToProps)(StopEntry);
