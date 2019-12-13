import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from "react";

export default ({ username, premiumMember, classes }) => (
    <Grid container alignItems="center">
        <Grid item xs>
            <Typography className={classes.title} gutterBottom variant="h4">
                Welcome to Trader Pro
            </Typography>
        </Grid>
        <Grid item lg container justify="flex-end">
            <Chip className={classes.username} color="primary" label={`${username} | Support ID 24442`} />
            <Chip className={classes.subscription} color="#F44336" label={`Subscription: ${premiumMember ? "Active" : "Expired"}`} />
        </Grid>
    </Grid>
);