import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import { connect } from "react-redux";
import * as actions from "../../../../actions/stopLoss";
import StyledMenu from "../../../MaterialUI/StyledMenu";
import StyledMenuItem from "../../../MaterialUI/StyledMenuItem";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    height: "50px",
    backgroundColor: theme.palette.background.paper
  },
  group: {
    margin: theme.spacing(1, 0)
  },
  formControlLabel: {
    fontSize: "0.6rem",
    "& label": {
      fontSize: "0.6rem"
    }
  },
  textField: {
    marginRight: theme.spacing(2),
    width: 50
  }
}));

const StopLoss = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Change the text when the fields change
  React.useEffect(() => {
    var box1Val = props.trailing ? "x" : "-";
    var box2Val = props.hedged ? "x" : "-";
    var unit = props.units === "Percent" ? "(%)" : props.units;

    props.onTextUpdate(`${props.offset} ${unit} [${box1Val}][${box2Val}]`);
  }, [props.offset, props.units, props.hedged, props.trailing]);

  // Load all the runners / set All / The Field as the default
  React.useEffect(() => {
    props.onSelection(
      Object.keys(props.runners).map(key => [props.runners[key].selectionId])
    );
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
            primary="Runners"
            secondary={
              props.selections
                ? typeof props.selections === "string"
                  ? props.runners[props.selections].runnerName
                  : "All / The Field"
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
        {/* The Menu Item for All / the Field */}
        {props.runners ? (
          <StyledMenuItem
            key={`stop-loss-order-all/field`}
            className={classes.root}
            selected={typeof props.selections != "string"}
            onClick={handleMenuItemClick(Object.keys(props.runners).map(key => [props.runners[key].selectionId]))}
          >
            All / The Field
          </StyledMenuItem>
        ) : null}
        {/* Create Menu Items for all the runners and display their names
         * Store their selectionId to be used to place bets for event clicks
         */}
        {Object.keys(props.runners).map(key => (
          <StyledMenuItem
            key={`stop-loss-order-${props.runners[key].runnerName}`}
            className={classes.root}
            selected={key === props.selections}
            onClick={handleMenuItemClick(key)}
          >
            {props.runners[key].runnerName}
          </StyledMenuItem>
        ))}
      </StyledMenu>

      <RadioGroup
        aria-label="stoploss"
        name="stoploss"
        className={classes.group}
        value={props.units}
        onChange={e => props.onReceiveUnit(e.target.value)}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextField
            id="standard-number"
            className={classes.textField}
            type="number"
            value={props.offset}
            inputProps={{ min: "1", max: "100" }}
            onChange={e => props.onReceiveOffset(e.target.value)}
            margin="normal"
          />
          <FormControlLabel
            value="Ticks"
            className={classes.formControlLabel}
            control={<Radio color="primary" Radio />}
            label={<span>Tick</span>}
          />
          <FormControlLabel
            value="Percent"
            control={<Radio color="primary" />}
            label="%"
          />
        </div>
      </RadioGroup>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={props.trailing}
              onChange={e => props.onToggleTrailing(e.target.checked)}
            />
          }
          label="Trailing"
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={props.hedged}
              onChange={e => props.onToggleHedged(e.target.checked)}
            />
          }
          label="Hedged"
        />
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    text: state.stopLoss.text,
    offset: state.stopLoss.offset,
    units: state.stopLoss.units,
    trailing: state.stopLoss.trailing,
    hedged: state.stopLoss.hedged,
    runners: state.market.runners,
    selections: state.stopLoss.selections
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTextUpdate: text => dispatch(actions.setDisplayText(text)),
    onReceiveOffset: offset => dispatch(actions.setStopLossOffset(offset)),
    onReceiveUnit: unit => dispatch(actions.setStopLossUnit(unit)),
    onToggleTrailing: selected =>
      dispatch(actions.toggleStopLossTrailing(selected)),
    onToggleHedged: selected => dispatch(actions.toggleStopLossHedged(selected)),
    onSelection: selections => dispatch(actions.setSelections(selections))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StopLoss);
