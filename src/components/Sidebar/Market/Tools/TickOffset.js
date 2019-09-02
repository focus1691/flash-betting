import * as React from "react";
import { connect } from "react-redux";
import * as actions from "../../../../actions/tickOffset";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(5),
    width: 75
  }
}));

const TickOffset = props => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          id="standard-number"
          type="number"
          label="Stake"
          className={classes.textField}
          value={props.stake}
          onChange={e => props.onReceiveStake(e.target.value)}
          margin="normal"
        />
        <RadioGroup
          aria-label="tickoffset"
          name="tickoffset"
          value={props.unit}
          onChange={e => props.onReceiveUnit(e.target.value)}
        >
          <FormControlLabel
            className={classes.formControlLabel}
            value="Tick"
            control={<Radio />}
            label={<span>Tick</span>}
          />
          <FormControlLabel value="Percent" control={<Radio />} label="%" />
        </RadioGroup>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          id="standard-number"
          className={classes.textField}
          type="number"
          label="% Trigger"
          value={props.percentTrigger}
          onChange={e => props.onReceivePercentTrigger(e.target.value)}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={props.hedged}
              onChange={e => props.onReceiveHedged(e.target.checked)}
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
        stake: state.tickOffset.stake,
        unit: state.tickOffset.units,
        percentTrigger: state.tickOffset.percentTrigger,
        hedged: state.tickOffset.hedged
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        onReceiveStake: stake => dispatch(actions.setStake(stake)),
        onReceiveUnit: unit => dispatch(actions.setUnit(unit)),
        onReceivePercentTrigger: percent => dispatch(actions.setPercentTrigger(percent)),
        onReceiveHedged: selected => dispatch(actions.setHedged(selected))
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(TickOffset);