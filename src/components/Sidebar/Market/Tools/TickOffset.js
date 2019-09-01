import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
    },
    formControl: {
      margin: theme.spacing(3),
    },
    group: {
      margin: theme.spacing(1, 0),
    },
    formControlLabel: {
        fontSize: '0.6rem', 
        '& label': {
            fontSize: '0.6rem'
        } 
    }
  }));

const TickOffset = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <RadioGroup
            aria-label="gender"
            name="gender1"
            // className={classes.group}
            // value={value}
            // onChange={handleChange}
            >
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <TextField
                    id="standard-number"
                    type="number"
                    // className={classes.textField}
                    // value={props.offset}
                    // onChange={val => handleChange(val)}
                    margin="normal"
                />
                <FormControlLabel className={classes.formControlLabel} value="Tick" control={<Radio />}
                label={<span>Tick</span>}
                />
                <FormControlLabel value="Percent" control={<Radio />} label="%" />
            </div>
            </RadioGroup>
            <div style={{display: 'flex', flexDirection: 'row'}}>
            <TextField
                    id="standard-number2"
                    type="number"
                    // className={classes.textField}
                    // value={props.offset}
                    // onChange={val => handleChange(val)}
                    margin="normal"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            // value="checkedB"
                            color="primary"
                            // checked={props.hedged}
                            // onChange={val => props.onToggleTools({ visible: !props.tools.visible, open: props.tools.open })}
                        />
                    }
                    label="Hedged"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            // value="checkedB"
                            color="primary"
                            // checked={props.chaser}
                            // onChange={val => props.onToggleTools({ visible: !props.tools.visible, open: props.tools.open })}
                        />
                    }
                    label="Chaser"
                />
            </div>
        </React.Fragment>
    );
};

export default TickOffset;