import React, { useState } from "react";
import MyMarkets from "./MyMarkets";
import AllSports from "./AllSports";
import ActiveBets from "./ActiveBets";
import MultiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MultiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import useStyles from "../../Styles/Styles";

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid #fff",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
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
  },
  expanded: {}
})(MultiExpansionPanelSummary);

const Menu = () => {

  const [expanded, setExpanded] = useState("my_markets");

  const classes = useStyles();

  const handleChange = tab => (event, newExpanded) => {
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

export default Menu;