import React from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import useStyles from "../Styles/Styles";
import CountDown from "./Countdown";

const Event = props => {
  const classes = useStyles();

  const renderTitle = () => {
    if (props.marketOpen) return new Date(
      props.market.marketStartTime
    ).toLocaleTimeString() + " " + props.market.marketName + (props.market.event.venue ? ` ${props.market.event.venue}` : '');
    return "No Event Selected";
  }

  return (
    <div id="sidebar-event">
      <div id="sidebar-event-section-1">
        <div id="sidebar-event-section-2">
          <span>
            <CountDown />
          </span>
        </div>
        <Typography>
          Price: <b>5</b>
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
    currentEvent: state.sports.currentSport.currentEvent,
    market: state.market.currentMarket,
    marketOpen: state.market.marketOpen
  };
};

export default connect(mapStateToProps)(Event);
