import * as React from "react";
import { connect } from "react-redux";
import * as actions from "../../../../actions/lay";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2)
  },
  textField: {
    width: 45,
    margin: theme.spacing(1)
  },
  textField2: {
    width: 30,
    margin: theme.spacing(2)
  }
}));

const Lay = props => {
  const classes = useStyles();

  React.useEffect(() => {
    props.onTextUpdate(`${props.stake} @ ${props.price}`);
  }, [props.price, props.stake]);

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          id="standard-number"
          className={classes.textField}
          type="number"
          label="stake"
          value={props.stake}
          inputProps={{ min: "1"}}
          onChange={e => props.onReceiveStake(e.target.value)}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField}
          type="number"
          label="@"
          value={props.price}
          inputProps={{ min: "1"}}
          onChange={e => props.onReceivePrice(e.target.value)}
          margin="normal"
        />
        <Button variant="outlined" color="primary" className={classes.button}>
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
          onChange={e => props.onReceiveHours(e.target.value)}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField2}
          type="number"
          label="mm"
          value={props.minutes}
          onChange={e => props.onReceiveMinutes(e.target.value)}
          margin="normal"
        />
        <TextField
          id="standard-number"
          className={classes.textField2}
          type="number"
          label="ss"
          value={props.seconds}
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
    executionTime: state.lay.executionTime
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
    onToggleExecutionTime: time => dispatch(actions.toggleExecutionTime(time))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lay);
