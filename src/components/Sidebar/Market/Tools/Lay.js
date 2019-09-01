import React from 'react';
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
    formControlLabel: {
        flexDirection: 'row',
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
  }));

const Lay = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <TextField
                    id="standard-number"
                    className={classes.textField}
                    type="number"
                    // value={props.offset}
                    label="stake"
                    // onChange={val => handleChange(val)}
                    margin="normal"
                />
                <TextField
                    id="standard-number"
                    className={classes.textField}
                    type="number"
                    label="@"
                    // value={props.offset}
                    // onChange={val => handleChange(val)}
                    margin="normal"
                />
                <Button className={classes.button}>Submit</Button>
            </div>

            <div style={{display: 'flex', flexDirection: 'row'}}>
                <FormControlLabel
                    control={
                        <Checkbox
                            // value="checkedB"
                            color="primary"
                            // checked={props.tools.visible}
                            // onChange={val => props.onToggleTools({ visible: !props.tools.visible, open: props.tools.open })}
                        />
                    }
                    label="Fill/Kill"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            // value="checkedB"
                            color="primary"
                            // checked={props.tools.visible}
                            // onChange={val => props.onToggleTools({ visible: !props.tools.visible, open: props.tools.open })}
                        />
                    }
                    label="Stop Loss"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            // value="checkedB"
                            color="primary"
                            // checked={props.tools.visible}
                            // onChange={val => props.onToggleTools({ visible: !props.tools.visible, open: props.tools.open })}
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
                    // value={props.offset}
                    label="hh"
                    // onChange={val => handleChange(val)}
                    margin="normal"
                />
                <TextField
                    id="standard-number"
                    className={classes.textField}
                    type="number"
                    label="mm"
                    // value={props.offset}
                    // onChange={val => handleChange(val)}
                    margin="normal"
                />
                <TextField
                    id="standard-number"
                    className={classes.textField}
                    type="number"
                    label="ss"
                    // value={props.offset}
                    // onChange={val => handleChange(val)}
                    margin="normal"
                />

                <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    className={classes.formControlLabel}
                    // className={classes.group}
                    // value={value}
                    // onChange={handleChange}
                    >
                    <FormControlLabel value="Tick" control={<Radio />}
                    label={<span>-</span>}
                    />
                    <FormControlLabel value="Percent" control={<Radio />} label="+" />
                </RadioGroup>
            </div>
        </React.Fragment>
    );
};

export default Lay;