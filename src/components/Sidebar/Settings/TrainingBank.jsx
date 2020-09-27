import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

export default ({ receiveTrainingBalance, styles }) => (
    <>
        <AppBar className={styles.appBar} position="static">
            <Typography variant="h6" className={styles.title}>
                Training Bank
    </Typography>
        </AppBar>
        <TextField
            id="standard-name"
            label="Bank Balance"
            margin="normal"
            onChange={val => receiveTrainingBalance(val)}
        />
    </>
);