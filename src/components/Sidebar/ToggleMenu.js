import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/settings";
import Ladders from "./Market/Ladders";
import Tools from "./Market/Tools";
import UnmatchedBets from "./Market/UnmatchedBets";
import MatchedBets from "./Market/MatchedBets";
import ProfitLoss from "./Market/ProfitLoss";
import Graph from "./Market/Graphs";
import MarketInfo from "./Market/MarketInfo";
import UserMarkets from "./Menu/UserMarkets";
import AllSports from "./Menu/AllSports";
import UserBets from "./Menu/UserBets";
import SearchResults from "./Menu/SearchResults";
import Settings from "./Settings";
import MultiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MultiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MultiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import useStyles from "../Styles/Styles";

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

const ToggleMenu = props => {
  const [openTab, setOpenTab] = useState(2);
  const [expanded, setExpanded] = useState("my_markets");
  const [activeStyle, setActiveStyle] = useState("#389C41");

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

  const createToggleButton = (name, tab) => {
    return (
      <button
        className={"toggle-button"}
        style={openTab === tab ? { background: activeStyle } : {}}
        onClick={e => {
          setOpenTab(tab);
        }}
      >
        {name}
      </button>
    );
  };

  const renderActiveTab = () => {
    if (openTab === 1) {
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
    } else if (openTab === 2) {
      return (
        <React.Fragment>
          <Ladders />

					{props.tools.visible ?
						<React.Fragment>
							{createTitle("Tools", "static")}
							<Tools/>
						</React.Fragment>
					: null}

					{props.unmatchedBets.visible ?
						<React.Fragment>
							{createTitle("Unmatched Bets", "static")}
							<UnmatchedBets/>
						</React.Fragment>
					: null}

					{props.matchedBets.visible ?
						<React.Fragment>
							{createTitle("Matched Bets", "static")}
							<MatchedBets/>
						</React.Fragment>
					: null}

					{props.profitAndLoss.visible ?
						<React.Fragment>
							{createTitle("Profit & Loss", "static")}
							<ProfitLoss/>
						</React.Fragment>
					: null}

					{props.graphs.visible ?
						<React.Fragment>
							{createTitle("Graphs", "static")}
							<Graph/>
						</React.Fragment>
					: null}

					{props.marketInfo.visible ?
						<React.Fragment>
							{createTitle("Market Information", "static")}
							<MarketInfo/>
						</React.Fragment>
					: null}
        </React.Fragment>
      );
    } else if (openTab === 3) {
      return (
        <React.Fragment>
          <Settings></Settings>
        </React.Fragment>
      );
    }
  };

  return (
    <div id="toggle-buttons">
      {createToggleButton("Menu", 1)}
      {createToggleButton("Market", 2)}
      {createToggleButton("Settings", 3)}
      {renderActiveTab()}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    tools: state.settings.tools,
    unmatchedBets: state.settings.unmatchedBets,
    matchedBets: state.settings.matchedBets,
    profitAndLoss: state.settings.profitAndLoss,
    graphs: state.settings.graphs,
    marketInfo: state.settings.marketInfo
  };
};

export default connect(mapStateToProps)(ToggleMenu);
