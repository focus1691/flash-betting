import React from "react";
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default ({ premiumMember, classes }) => (
    <Grid container alignItems="center">
        <Grid item xs>
            <Typography className={classes.title} gutterBottom variant="h4">
                Welcome to Trader Pro
            </Typography>
        </Grid>
        <Grid item lg>
            <Chip className={classes.username} color="primary" label={`${localStorage.getItem("username")} | Support ID 24442`} />
            <Chip className={classes.subscription} color="#F44336" label={`Subscription: ${premiumMember ? "Active" : "Expired"}`} />
        </Grid>
    </Grid>
);