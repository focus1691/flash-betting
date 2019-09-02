import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/stopLoss';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    group: {
      margin: theme.spacing(1, 0),
    },
    formControlLabel: {
        fontSize: '0.6rem',
        '& label': {
            fontSize: '0.6rem'
        } 
    },
    textField: {
        marginRight: theme.spacing(2),
        width: 50,
      },
  }));

const StopLoss = props => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <RadioGroup
            aria-label="stoploss"
            name="stoploss"
            className={classes.group}
            value={props.units}
            onChange={e => props.onReceiveUnit(e.target.value)}
            >
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <TextField
                        id="standard-number"
                        className={classes.textField}
                        type="number"
                        value={props.offset}
                        onChange={e => props.onReceiveOffset(e.target.value)}
                        margin="normal"
                    />
                    <FormControlLabel value="Ticks" className={classes.formControlLabel} control={<Radio />}
                    label={<span>Tick</span>}
                    />
                    <FormControlLabel value="Percent" control={<Radio />} label="%" />
                </div>
            </RadioGroup>
            <div style={{display: 'flex', flexDirection: 'row'}}>
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
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            checked={props.chaser}
                            onChange={e => props.onToggleChaser(e.target.checked)}
                        />
                    }
                    label="Chaser"
                />
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return {
        offset: state.stopLoss.offset,
        units: state.stopLoss.units,
        trailing: state.stopLoss.trailing,
        hedged: state.stopLoss.hedged,
        chaser: state.stopLoss.chaser
	};
}

const mapDispatchToProps = dispatch => {
	return {
        onReceiveOffset: offset => dispatch(actions.setStopLossOffset(offset)),
        onReceiveUnit: unit => dispatch(actions.setStopLossUnit(unit)),
        onToggleTrailing: selected => dispatch(actions.toggleStopLossTrailing(selected)),
        onToggleHedged: selected => dispatch(actions.toggleStopLossHedged(selected)),
        onToggleChaser: selected => dispatch(actions.toggleStopLossChaser(selected))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(StopLoss);