import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import { connect } from "react-redux";
import * as actions from "../../../../actions/tickOffset";

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(5),
    width: 75
  }
}));

const TickOffset = props => {
  const classes = useStyles();

  React.useEffect(() => {
    var unit = props.unit === "Percent" ? "%" : props.unit;
    var percent = `(${props.percentTrigger}%)`;

    props.onTextUpdate(`${props.ticks} ${unit} ${percent} [${props.hedged ? "x" : "-"}]`);

  }, [props.ticks, props.unit, props.percentTrigger, props.hedged]);

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          id="standard-number"
          type="number"
          label="Ticks"
          className={classes.textField}
          value={props.ticks}
          inputProps={{ min: "1", max: "100" }}
          onChange={e => props.onReceiveTicks(e.target.value)}
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
            value="Ticks"
            control={<Radio color="primary" />}
            label="Ticks"
          />
          <FormControlLabel
            value="Percent"
            control={<Radio color="primary" />}
            label="%"
          />
        </RadioGroup>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          id="standard-number"
          className={classes.textField}
          type="number"
          label="% Trigger"
          value={props.percentTrigger}
          inputProps={{ min: "1", max: "100" }}
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
    text: state.tickOffset.text,
    ticks: state.tickOffset.ticks,
    unit: state.tickOffset.units,
    percentTrigger: state.tickOffset.percentTrigger,
    hedged: state.tickOffset.hedged
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTextUpdate: text => dispatch(actions.setDisplayText(text)),
    onReceiveTicks: ticks => dispatch(actions.setTicks(ticks)),
    onReceiveUnit: unit => dispatch(actions.setUnit(unit)),
    onReceivePercentTrigger: percent =>
      dispatch(actions.setPercentTrigger(percent)),
    onReceiveHedged: selected => dispatch(actions.setHedged(selected))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TickOffset);
