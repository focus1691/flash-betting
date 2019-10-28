import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import SocketContext from "../../SocketContext";
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Header from "./Header";

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
    backgroundColor: '#000',
  },
}));

const HomeView = props => {

  const styleProps = { subscribed: props.premiumMember };
  const [data, setData] = useState({});

  const classes = useStyles(styleProps);

  useEffect(() => {
    props.premiumMember ? setData({
      subscribed: "Active",
      information: " and you can now have full access to the Ladder View.",
      color: "#4CAF50"
    })
      : setData({
        subscribed: "Inactive",
        information: " and you have restricted access to Trader Pro.",
        color: "#F44336"
      })
  }, [props.premiumMember]);


  return (
    <div id="home-view-container" className={classes.root}>
      <div className={classes.section2} id="home-view">
        <Header premiumMember={props.premiumMember} classes={classes} />
        <Divider className={classes.divider} variant="middle" />
        <Grid container alignItems="center">
          <Typography className={classes.subheading} style={{ whiteSpace: 'pre-wrap' }} variant="h5">
            Trader Pro Membership is <span style={{ color: data.color }}>{data.subscribed}</span>
          </Typography>
        </Grid>
        <Grid container alignItems="center">
          <Typography className={`${classes.premiumStatus} ${classes.textMargin}`} gutterBottom variant="h6">
            Your Trader Pro Membership is <span>{data.subscribed}</span>
          </Typography>
          <Typography variant="p">{data.information}</Typography>
        </Grid>
        <Grid container alignItems="center">
          <Typography className={`${classes.textMargin}`} gutterBottom variant="p">
            Contact us on <a href={"malito:joshbetting30@yahoo.com"}>joshbetting30@yahoo.com</a> if you experience any issues when using Trader Pro.
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