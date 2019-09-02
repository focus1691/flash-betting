import * as React from "react";
import { connect } from "react-redux";
import * as actions from "../../../../actions/stopEntry";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 75
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
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  backPriceTextFields: {
    width: 75,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const StopEntry = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>LTP</InputLabel>
          <Select
            native
            value={props.operator}
            onChange={e => props.onReceiveOperator(e.target.value)}
            input={<OutlinedInput name="age" />}
          >
            <option value="" />
            <option value={"<"}>{"<"}</option>
            <option value={"="}>{"="}</option>
            <option value={">"}>{">"}</option>
          </Select>
        </FormControl>
        <TextField
            id="standard-number"
            className={classes.textField}
            type="number"
            label="Ticks"
            value={props.ticks}
            onChange={e => props.onReceiveTicks(e.target.value)}
            margin="normal"
          />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
              id="standard-number"
              className={classes.backPriceTextFields}
              type="number"
              label="Back"
              value={props.stake}
              onChange={e => props.onReceiveStake(e.target.value)}
              margin="normal"
            />
        <TextField
              id="standard-number"
              className={classes.backPriceTextFields}
              type="number"
              label="@"
              value={props.price}
              onChange={e => props.onReceivePrice(e.target.value)}
              margin="normal"
            />
      </div>
      <Button variant="outlined" color="primary" className={classes.button}>Submit</Button>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    operator: state.stopEntry.operator,
    ticks: state.stopEntry.ticks,
    stake: state.stopEntry.stake,
    price: state.stopEntry.price
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onReceiveOperator: operator => dispatch(actions.setLTPOperator(operator)),
    onReceiveTicks: ticks => dispatch(actions.setTicks(ticks)),
    onReceiveStake: stake => dispatch(actions.setStake(stake)),
    onReceivePrice: price => dispatch(actions.setPrice(price))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StopEntry);