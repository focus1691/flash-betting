import React, { useState } from "react";
import UserMarkets from "./UserMarkets";
import AllSports from "./AllSports";
import UserBets from "./UserBets";
import SearchResults from "./SearchResults";
import MultiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MultiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MultiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
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
      "&:before": {
        display: "none"
      },
      "&$expanded": {
        margin: "auto"
      },
      backgroundColor: "#fff",
      color: "orange",
      fontWeight: "900"
    },
    expanded: {}
  })(MultiExpansionPanel);
  
  const ExpansionPanelSummary = withStyles({
    root: {
      backgroundColor: "rgba(0, 0, 0, .03)",
      borderBottom: "1px solid rgba(0, 0, 0, .125)",
      marginBottom: -1,
      minHeight: 56,
      "&$expanded": {
        minHeight: 56
      }
    },
    content: {
      "&$expanded": {
        margin: "12px 0"
      }
    },
    expanded: {}
  })(MultiExpansionPanelSummary);
  
  const ExpansionPanelDetails = withStyles(theme => ({
    root: {
      padding: theme.spacing(2)
    }
  }))(MultiExpansionPanelDetails);

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
            <UserMarkets />
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
            <UserBets />
          </ExpansionPanel>

          <ExpansionPanel
            expanded={expanded === "search_results"}
            onChange={handleChange("search_results")}
          >
            {createExpansionPanelSummary("Search Results")}
            <SearchResults />
          </ExpansionPanel>
        </React.Fragment>
      );
};

export default Menu;