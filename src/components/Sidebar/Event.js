import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import useStyles from "../Styles/Styles";
import CountDown from "./Countdown";

const Event = ({ market, marketOpen, marketStatus, inPlay, pastEventTime }) => {
  const classes = useStyles();
  const [bgColour, setBGColor] = useState("#303030");

  const renderTitle = () => {
    if (marketOpen) return new Date(
      market.marketStartTime
    ).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }) + " " + market.marketName + (market.event.venue ? ` ${market.event.venue}` : '');
    return "No Event Selected";
  }

  useEffect(() => {
    if (marketStatus === "SUSPENDED") setBGColor("red");
    else if (marketStatus === "CLOSED") setBGColor("#303030");
    else if (new Date() > new Date(market.marketStartTime) && inPlay) setBGColor("green");
    else if (new Date() > new Date(market.marketStartTime) && pastEventTime) setBGColor("orange");
    else setBGColor("#303030");
  }, [marketStatus, inPlay, pastEventTime]);

  return (
    <div id="sidebar-event">
      <div id="sidebar-event-section-1">
        <div id="sidebar-event-section-2" style={{ background: bgColour }}>
          <span>
            <CountDown />
          </span>
        </div>
        <Typography>
          Price: <b>{market.description ? market.description.marketBaseRate : null}</b>
        </Typography>
        <Typography>
          API: <b>33.87</b>
        </Typography>
      </div>
      <AppBar className={classes.AppBar} position="static">
        <Typography variant="h6" className={classes.title}>
          {renderTitle()}
        </Typography>
      </AppBar>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    market: state.market.currentMarket,
    marketOpen: state.market.marketOpen,
    marketStatus: state.market.status,
    inPlay: state.market.inPlay,
    pastEventTime: state.market.pastEventTime
  };
};

export default connect(mapStateToProps)(Event);