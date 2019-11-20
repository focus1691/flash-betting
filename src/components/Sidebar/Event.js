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
    ).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}) + " " + props.market.marketName + (props.market.event.venue ? ` ${props.market.event.venue}` : '');
    return "No Event Selected";
  }

  const getClockBG = () => {

    if (props.marketStatus === "SUSPENDED") return "red";
    else if (props.marketStatus === "CLOSED") return "#303030";

    else if (new Date() > new Date(props.market.marketStartTime)) {
      return props.inPlay ? "green" : "orange";
    } else {
      return "#303030";
    }
  };

  return (
    <div id="sidebar-event">
      <div id="sidebar-event-section-1">
        <div id="sidebar-event-section-2" style={{background: getClockBG()}}>
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
    marketOpen: state.market.marketOpen,
    marketStatus: state.market.status,
    inPlay: state.market.inPlay
  };
};

export default connect(mapStateToProps)(Event);
