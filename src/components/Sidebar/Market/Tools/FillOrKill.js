import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexDirection: 'row',
    },
    number: {
        marginLeft: theme.spacing(1),
        width: 50,
    },
  }));

const FillOrKill = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.root}>
                <TextField
                    id="standard-number"
                    className={classes.number}
                    type="number"
                    label="Seconds"
                    // value={props.offset}
                    // onChange={val => handleChange(val)}
                    margin="normal"
                />
            </div>
        </React.Fragment>
    );
};

export default FillOrKill;