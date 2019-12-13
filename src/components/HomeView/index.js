import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { connect } from "react-redux";
import { openPremiumDialog, setSelectedPremium } from "../../actions/settings";
import SocketContext from "../../SocketContext";
import Header from "./Header";
import SubscriptionContainer from "./SubscriptionContainer";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  textMargin: {
    margin: "10px 5px 10px 0px",
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
    marginLeft: '10px'
  }),
  subheading: {
    marginTop: '10px'
  },
  premiumStatus: {
    margin: "10px 5px 10px 0px",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  divider: {
    backgroundColor: '#000',
  },
}));

const HomeView = props => {

  const [cookies] = useCookies(['username']);
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
        <Header username={cookies.username} premiumMember={props.premiumMember} classes={classes} />
        <Divider className={classes.divider} />
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
            Contact us on <a href={"mailto:joshbetting30@yahoo.com"}>joshbetting30@yahoo.com</a> if you experience any issues when using Trader Pro.
          </Typography>
        </Grid>
        <Divider className={classes.divider} />
        <div className = {"subscription-list"}>
          {
            props.premiumMember ? null :
            <React.Fragment>
              <SubscriptionContainer openPremiumMenu = {props.openPremiumMenu} setSelectedPremium = {props.setSelectedPlan} />
              <SubscriptionContainer plan = "Biannually" price = {49.99} color = {'green'} openPremiumMenu = {props.openPremiumMenu} setSelectedPremium = {props.setSelectedPlan} />
              <SubscriptionContainer plan = "Annually" price = {99.99} openPremiumMenu = {props.openPremiumMenu} setSelectedPremium = {props.setSelectedPlan} />
            </React.Fragment>
          }
          
        </div>
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

const mapDispatchToProps = dispatch => {
  return {
    openPremiumMenu: isPremium => dispatch(openPremiumDialog(isPremium)),
    setSelectedPlan: premiumSelected => dispatch(setSelectedPremium(premiumSelected))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeViewWithSocket);