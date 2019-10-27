import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  chip: {
    marginRight: theme.spacing(1),
    textAlign: "right",
  },
  section1: {
    margin: theme.spacing(3, 2),
  },
  section2: {
    margin: theme.spacing(2),
  },
  section3: {
    margin: theme.spacing(3, 1, 1),
  },
}));

export default () => {
  const classes = useStyles();

  return (
    <div id="home-view-container" className={classes.root}>
      <div id="home-view">
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography gutterBottom variant="h4">
              Welcome to Trader Pro
              <Chip className={classes.chip} color="primary" label="Soft" />
            </Typography>
          </Grid>
        </Grid>
        <Divider variant="middle" />
      </div>
    </div>
  );
};
