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
  textMargin: {
    marginLeft: "10px",
    padding: "10px",
  },
  title: {
    marginLeft: "5px",
  },
  username: {
    marginLeft: "10px",
    background: "#000",
    color: "#fff",
  },
  subscription: props => ({
    background: props.subscribed ? "#4CAF50" : "#F44336",
    color: "#000",
  }),
  subheading: {
    margin: "10px 5px 10px 5px",
    padding: "10px",
  },
  premiumStatus: {
    margin: "10px 5px 10px 5px",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  divider: {
    backgroundColor: '#FFF',
  },
  hyperlinkColor: {
    color: "#000",
  },
}));

const HomeView = props => {

  const styleProps = { subscribed: props.premiumMember };

  const classes = useStyles(styleProps);

  return (
    <div id="home-view-container" className={classes.root}>
      <div className={classes.section2} id="home-view">
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography className={classes.title} gutterBottom variant="h4">
              Welcome to Trader Pro
            </Typography>
          </Grid>
          <Grid item lg>
            <Chip className={classes.username} color="primary" label={`${localStorage.getItem("username")} | Support ID 24442`} />
            <Chip className={classes.subscription} color="#F44336" label={`Subscription: ${props.premiumMember ? "Active" : "Expired"}`} />
          </Grid>
        </Grid>
        <Divider className={classes.divider} variant="middle" />
        <Grid container alignItems="center">
          <Typography className={classes.subheading} style={{ whiteSpace: 'pre-wrap' }} variant="h5">
            Trader Pro Membership is <span style={{ color: props.premiumMember ? "#4CAF50" : "#F44336" }}>Active</span>
          </Typography>
        </Grid>
        <Grid container alignItems="center">
          <Typography className={`${classes.premiumStatus} ${classes.textMargin}`} gutterBottom variant="h6">
            Your Trader Pro Membership is Active
          </Typography>
          <Typography variant="p">&nbsp;and you can now have access to the Ladder View.</Typography>
        </Grid>
        <Grid container alignItems="center">
          <Typography className={`${classes.textMargin}`} gutterBottom variant="p">
            Contact us on <a className={classes.hyperlinkColor} href={"malito:alex@trademarkapps.co.uk"}>alex@trademarkapps.co.uk</a> if you experience any issues when using Trader Pro.
          </Typography>
        </Grid>
        <Divider className={classes.divider} variant="middle" />
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