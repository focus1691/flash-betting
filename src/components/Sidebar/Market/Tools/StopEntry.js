import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";

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

const StopEntry = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            
        </React.Fragment>
    );
};

export default StopEntry;