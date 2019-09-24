import * as React from "react";
import { connect } from "react-redux";
import * as actions from "../../../../actions/stopLoss";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import StyledMenuItem from '../../../MaterialUI/StyledMenuItem';
import StyledMenu from '../../../MaterialUI/StyledMenu';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    height: '50px',
    backgroundColor: theme.palette.background.paper,
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
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const options = [
    'Show some love to Material-UI',
    'Show all notification content',
    'Hide sensitive notification content',
    'Hide all notification content',
  ];

  React.useEffect(() => {
    var box1Val = props.trailing ? "x" : "-";
    var box2Val = props.hedged ? "x" : "-";
    var unit = props.units === "Percent" ? "(%)" : props.units;

    props.onTextUpdate(`${props.offset} ${unit} [${box1Val}][${box2Val}]`);
  }, [props.offset, props.units, props.hedged, props.trailing]);

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
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
          // aria-label="when device is locked"
          onClick={handleClickListItem}
        >
          <ListItemText
            // primary="When device is locked"
            secondary={options[selectedIndex]}
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
        {options.map((option, index) => (
          <StyledMenuItem
            key={option}
            className={classes.root}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
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
    text: state.back.text,
    offset: state.stopLoss.offset,
    units: state.stopLoss.units,
    trailing: state.stopLoss.trailing,
    hedged: state.stopLoss.hedged
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTextUpdate: text => dispatch(actions.setDisplayText(text)),
    onReceiveOffset: offset => dispatch(actions.setStopLossOffset(offset)),
    onReceiveUnit: unit => dispatch(actions.setStopLossUnit(unit)),
    onToggleTrailing: selected =>
      dispatch(actions.toggleStopLossTrailing(selected)),
    onToggleHedged: selected => dispatch(actions.toggleStopLossHedged(selected))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StopLoss);
