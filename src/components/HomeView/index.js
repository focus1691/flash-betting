import React from "react";
import { connect } from "react-redux";
import SocketContext from "../../SocketContext";
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
  subscription: props => ({
    background: props.subscribed ? "#4CAF50" : "#F44336",
    color: "#FFF",
  }),
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

const HomeView = props => {

  const styleProps = { subscribed: props.premiumMember };

  const classes = useStyles(styleProps);

  return (
    <div id="home-view-container" className={classes.root}>
      <div id="home-view">
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography gutterBottom variant="h4">
              Welcome to Trader Pro
            </Typography>
          </Grid>
          <Grid item lg>
            <Chip className={classes.chip} color="primary" label="joshbetting30@yahoo.com | Support ID 24442" />
            <Chip className={classes.subscription} color="#F44336" label="Subscription: Expired" />
          </Grid>
        </Grid>
        <Divider variant="middle" />
        <Grid container alignItems="center">
        </Grid>
      </div>
    </div>
  );
};

const HomeViewWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <HomeView {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const mapStateToProps = state => {
  return {
    premiumMember: state.settings.premiumMember
  };
};

export default connect(
  mapStateToProps
)(HomeViewWithSocket);