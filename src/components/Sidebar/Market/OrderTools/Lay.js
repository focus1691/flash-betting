import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import crypto from 'crypto';
import * as React from "react";
import { connect } from "react-redux";
import * as actions from "../../../../actions/lay";
import { formatPrice, getNextPrice } from "../../../../utils/ladder/CreateFullLadder";
import StyledMenu from "../../../MaterialUI/StyledMenu";
import StyledMenuItem from "../../../MaterialUI/StyledMenuItem";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2)
  },
  textField: {
    width: 40,
    margin: theme.spacing(1)
  },
  textField2: {
    width: 30,
    margin: theme.spacing(2)
  }
}));

const Lay = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Change the text when the fields change
  React.useEffect(() => {
    props.onTextUpdate(`${props.stake} @ ${props.price}`);
  }, [props.price, props.stake]);

  // Load all the runners / set All / The Field as the default
  React.useEffect(() => {
    props.onSelection((Object.keys(props.runners).map(key => [
      props.runners[key].selectionId
    ])));
  }, []);

  const handleClickListItem = () => e => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuItemClick = index => e => {
    props.onSelection(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle Submit click to place an order
  const placeOrder = () => async e => {

    const selections = typeof props.selections == "string" ? [props.selections] : props.selections

    const newLayList = Object.assign({}, props.list)

    await Promise.all(selections.map(async (selection, index) => {
      const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15)
      const convertedSelection = parseInt(selection);
      const addedOrder = {
        strategy: "Lay",
        marketId: props.market.marketId,
        selectionId: convertedSelection,
        executionTime: props.executionTime,
        timeOffset: (props.hours * 3600) + (props.minutes * 60) + parseInt(props.seconds),
        size: props.stake,
        price: formatPrice(props.price),
        rfs: referenceStrategyId
      };

      // make sure request is processed before saving it

      await fetch('/api/save-order', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(addedOrder)
      }).then(() => {
        if (newLayList[convertedSelection] === undefined) {
          newLayList[convertedSelection] = [addedOrder]
        } else {
          newLayList[convertedSelection] = newLayList[convertedSelection].concat(addedOrder)
        }
      });
    }));
    props.onUpdateLayList(newLayList);
  };

  return (
    <React.Fragment>
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
              props.selections
                ? typeof props.selections === "string"
                  ? props.runners[props.selections].runnerName
                  : "Lay All / The Field"
                : ""
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
        {props.runners ? (
          <StyledMenuItem
            key={`lay-order-all/field`}
            className={classes.root}
            selected={typeof props.selections != "string"}
            onClick={handleMenuItemClick(Object.keys(props.runners).map(key => [props.runners[key].selectionId]))}
          >
            Lay All / The Field
          </StyledMenuItem>
        ) : null}

        {/* Create Menu Items for all the runners and display their names
         * Store their selectionId to be used to place bets for event clicks
         */}
        {Object.keys(props.runners).map(key => (
          <StyledMenuItem
            key={`lay-order-${props.runners[key].runnerName}`}
            className={classes.root}
            selected={key === props.selections}
            onClick={handleMenuItemClick(key)}
          >
            {props.runners[key].runnerName}
          </StyledMenuItem>
        ))}
      </StyledMenu>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          id="standard-number"
          className={classes.textField}
          type="number"
          label="stake"
          value={props.stake}
          inputProps={{ min: "1", style: { fontSize: 10 } }}
          onChange={e => props.onReceiveStake(e.target.value)}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField}
          type="number"
          label="@"
          value={props.price}
          inputProps={{ min: "1.01", max: "1000", style: { fontSize: 10 } }}
          onChange={e => props.onReceivePrice(getNextPrice(props.price, e.target.value))}
          margin="normal"
        />
        <Button variant="outlined" color="primary" className={classes.button} onClick={placeOrder()}>
          Submit
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          id="standard-number"
          className={classes.textField2}
          type="number"
          label="hh"
          value={props.hours}
          inputProps={{ min: "0", style: { fontSize: 10 } }}
          onChange={e => props.onReceiveHours(e.target.value)}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField2}
          type="number"
          label="mm"
          value={props.minutes}
          inputProps={{ min: "0", max: "59", style: { fontSize: 10 } }}
          onChange={e => props.onReceiveMinutes(e.target.value)}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField2}
          type="number"
          label="ss"
          value={props.seconds}
          inputProps={{ min: "0", max: "59", style: { fontSize: 10 } }}
          onChange={e => props.onReceiveSeconds(e.target.value)}
          margin="normal"
        />

        <RadioGroup
          aria-label="orderexecution"
          name="orderexecution"
          value={props.executionTime}
          onChange={e => props.onToggleExecutionTime(e.target.value)}
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
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    text: state.lay.text,
    stake: state.lay.stake,
    price: state.lay.price,
    hours: state.lay.offset.hours,
    minutes: state.lay.offset.minutes,
    seconds: state.lay.offset.seconds,
    executionTime: state.lay.executionTime,
    market: state.market.currentMarket,
    runners: state.market.runners,
    selections: state.lay.selections,
    list: state.lay.list
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTextUpdate: text => dispatch(actions.setDisplayText(text)),
    onReceiveStake: stake => dispatch(actions.setStake(stake)),
    onReceivePrice: price => dispatch(actions.setPrice(price)),
    onReceiveHours: hours => dispatch(actions.setHours(hours)),
    onReceiveMinutes: minutes => dispatch(actions.setMinutes(minutes)),
    onReceiveSeconds: seconds => dispatch(actions.setSeconds(seconds)),
    onToggleExecutionTime: time => dispatch(actions.toggleExecutionTime(time)),
    onSelection: selections => dispatch(actions.setSelections(selections)),
    onUpdateLayList: list => dispatch(actions.updateLayList(list))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lay);