import AppBar from "@material-ui/core/AppBar";
import MultiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MultiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { connect } from 'react-redux';
import { updateCurrentSubmenu, updateSubmenuList, updateSubmenuListMyMarkets, updateSubmenuMyMarkets } from "../../../actions/sport";
import useStyles from "../../Styles/Styles";
import ActiveBets from "./ActiveBets";
import AllSports from "./AllSports";
import MyMarkets from "./MyMarkets";

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid #fff",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
      margin: 0,
    },
    backgroundColor: "#fff",
    color: "orange",
    fontWeight: "900",
    fontSize: "0.8em",
    display: "block",
  },
  expanded: {}
})(MultiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    zIndex: "1",
    "&$expanded": {
      minHeight: "0px",
    },
  },
  expanded: {
    minHeight: "0px",
  },
})(MultiExpansionPanelSummary);

const Menu = props => {

  const [expanded, setExpanded] = useState("my_markets");

  const classes = useStyles();

  const handleChange = tab => (event, newExpanded) => {
    if (expanded === tab && tab === "all_sports") {
      props.onUpdateSubmenuCurrent("");
      props.onUpdateSubmenuList({});
      return;
    } else if (expanded === tab && tab === "my_markets") {
      props.onUpdateSubmenuMyMarkets("");
      props.onUpdateSubmenuListMyMarkets({});
      return;
    }
    setExpanded(newExpanded ? tab : false);
  };

  const createExpansionPanelSummary = name => {
    return (
      <ExpansionPanelSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {createTitle(name)}
      </ExpansionPanelSummary>
    );
  };

  const createTitle = (name, position) => {
    return (
      <AppBar className={classes.appBar} position={position || "absolute"}>
        <Typography variant="h6" className={classes.title}>
          {name}
        </Typography>
      </AppBar>
    );
  };

  return (
    <React.Fragment>
      <ExpansionPanel
        expanded={expanded === "my_markets"}
        onChange={handleChange("my_markets")}
      >
        {createExpansionPanelSummary("My Markets")}
        <MyMarkets />
      </ExpansionPanel>

      <ExpansionPanel
        expanded={expanded === "all_sports"}
        onChange={handleChange("all_sports")}
      >
        {createExpansionPanelSummary("All Sports")}
        <AllSports />
      </ExpansionPanel>

      <ExpansionPanel
        expanded={expanded === "active_bets"}
        onChange={handleChange("active_bets")}
      >
        {createExpansionPanelSummary("Active Bets")}
        <ActiveBets />
      </ExpansionPanel>
    </React.Fragment>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateSubmenuCurrent: submenuCurrent => dispatch(updateCurrentSubmenu(submenuCurrent)),
    onUpdateSubmenuList: submenuList => dispatch(updateSubmenuList(submenuList)),
    onUpdateSubmenuMyMarkets: submenuCurrent => dispatch(updateSubmenuMyMarkets(submenuCurrent)),
    onUpdateSubmenuListMyMarkets: submenu => dispatch(updateSubmenuListMyMarkets(submenu))
  };
};

export default connect(null, mapDispatchToProps)(Menu);