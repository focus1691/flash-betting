import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/lay';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing(1),
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  }));

const Lay = props => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <TextField
                    id="standard-number"
                    className={classes.textField}
                    type="number"
                    label="stake"
                    value={props.stake}
                    onChange={e => props.onReceiveStake(e.target.value)}
                    margin="normal"
                />
                <TextField
                    id="standard-number"
                    className={classes.textField}
                    type="number"
                    label="@"
                    value={props.price}
                    onChange={e => props.onReceivePrice(e.target.value)}
                    margin="normal"
                />
                <Button className={classes.button}>Submit</Button>
            </div>

            <div style={{display: 'flex', flexDirection: 'row'}}>
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            checked={props.fillOrKill}
                            onChange={e => props.ontoggleFillOrKill(e.target.checked)}
                        />
                    }
                    label="Fill/Kill"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            checked={props.stopLoss}
                            onChange={e => props.onToggleStopLoss(e.target.checked)}
                        />
                    }
                    label="Stop Loss"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            checked={props.tickOffset}
                            onChange={e => props.onToggleTickOffset(e.target.checked)}
                        />
                    }
                    label="Tick Offset"
                />
            </div>

            <div style={{display: 'flex', flexDirection: 'row'}}>

                <TextField
                    id="standard-number"
                    className={classes.textField}
                    type="number"
                    label="hh"
                    value={props.hours}
                    onChange={e => props.onReceiveHours(e.target.value)}
                    margin="normal"
                />
                <TextField
                    id="standard-number"
                    className={classes.textField}
                    type="number"
                    label="mm"
                    value={props.minutes}
                    onChange={e => props.onReceiveMinutes(e.target.value)}
                    margin="normal"
                />
                <TextField
                    id="standard-number"
                    className={classes.textField}
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

                    <FormControlLabel value="Before" className={classes.formControlLabel} control={<Radio />}
                    label={<span>-</span>}
                    />

                    <FormControlLabel value="After" control={<Radio />} label="+" />
                </RadioGroup>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return {
        stake: state.lay.stake,
        price: state.lay.price,
        fillOrKill: state.lay.fillOrKill,
        stopLoss: state.lay.stopLoss,
        tickOffset: state.lay.tickOffset,
        hours: state.lay.offset.hours,
        minutes: state.lay.offset.minutes,
        seconds: state.lay.offset.seconds,
        executionTime: state.lay.executionTime
	};
}

const mapDispatchToProps = dispatch => {
	return {
        onReceiveStake: stake => dispatch(actions.setStake(stake)),
        onReceivePrice: price => dispatch(actions.setPrice(price)),
        ontoggleFillOrKill: selected => dispatch(actions.toggleFillOrKill(selected)),
        onToggleStopLoss: selected => dispatch(actions.toggleStopLoss(selected)),
        onToggleTickOffset: selected => dispatch(actions.toggleTickOffset(selected)),
        onReceiveHours: hours => dispatch(actions.setHours(hours)),
        onReceiveMinutes: minutes => dispatch(actions.setMinutes(minutes)),
        onReceiveSeconds: seconds => dispatch(actions.setSeconds(seconds)),
        onToggleExecutionTime: time => dispatch(actions.toggleExecutionTime(time))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Lay);