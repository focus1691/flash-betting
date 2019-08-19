import React, { useState } from 'react';
import Ladders from "./Market/Ladders";
import UnmatchedBets from "./Market/UnmatchedBets";
import MatchedBets from "./Market/MatchedBets";
import ProfitLoss from "./Market/ProfitLoss";
import Graph from "./Market/Graphs";
import UserMarkets from "./Menu/UserMarkets";
import AllSports from "./Menu/AllSports";
import UserBets from "./Menu/UserBets";
import SearchResults from "./Menu/SearchResults";
import Settings from "./Settings";
import MultiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MultiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MultiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import useStyles from '../Styles/Styles';

const ExpansionPanel = withStyles({
	root: {
	  border: '1px solid #fff',
	  boxShadow: 'none',
	  '&:not(:last-child)': {
		borderBottom: 0,
	  },
	  '&:before': {
		display: 'none',
	  },
	  '&$expanded': {
		margin: 'auto',
	  },
	//   background: "#303030",
	backgroundColor: '#fff',
	  color: "orange",
	  fontWeight: "900",
	},
	expanded: {},
  })(MultiExpansionPanel);
  
  const ExpansionPanelSummary = withStyles({
	root: {
	  backgroundColor: 'rgba(0, 0, 0, .03)',
	  borderBottom: '1px solid rgba(0, 0, 0, .125)',
	  marginBottom: -1,
	  minHeight: 56,
	  '&$expanded': {
		minHeight: 56,
	  },
	},
	content: {
	  '&$expanded': {
		margin: '12px 0',
	  },
	},
	expanded: {},
  })(MultiExpansionPanelSummary);
  
  const ExpansionPanelDetails = withStyles(theme => ({
	root: {
	  padding: theme.spacing(2),
	},
  }))(MultiExpansionPanelDetails);

export default () => {

	const [openTab, setOpenTab] = useState(2);
	const [expanded, setExpanded] = useState("my_markets");
	const [activeStyle, setActiveStyle] = useState("#389C41");

	const classes = useStyles();

	const handleChange = tab => (event, newExpanded) => {
		setExpanded(newExpanded ? tab : false);
	};

	const renderActiveTab = () => {
		if (openTab === 1) {
			return (
				<React.Fragment>
					<ExpansionPanel expanded={expanded === "my_markets"} onChange={handleChange("my_markets")}>
						<ExpansionPanelSummary
							aria-controls="panel1a-content"
							id="panel1a-header">
							<AppBar className={classes.appBar} position="static">
							<Typography variant="h6" className={classes.title}>
							My Markets
							</Typography>
							</AppBar>
						</ExpansionPanelSummary>
						<UserMarkets></UserMarkets>
					</ExpansionPanel>

					<ExpansionPanel expanded={expanded === "all_sports"} onChange={handleChange("all_sports")}>
						<ExpansionPanelSummary
							aria-controls="panel1a-content"
							id="panel1a-header">
							<AppBar className={classes.appBar} position="static">
							<Typography variant="h6" className={classes.title}>
							All Sports
							</Typography>
							</AppBar>
						</ExpansionPanelSummary>
						<AllSports></AllSports>
					</ExpansionPanel>

					<ExpansionPanel expanded={expanded === "active_bets"} onChange={handleChange("active_bets")}>
						<ExpansionPanelSummary
							aria-controls="panel1a-content"
							id="panel1a-header">
							<AppBar className={classes.appBar} position="static">
							<Typography variant="h6" className={classes.title}>
							Active Bets
							</Typography>
							</AppBar>
						</ExpansionPanelSummary>
						<UserBets></UserBets>
					</ExpansionPanel>

					<ExpansionPanel expanded={expanded === "search_results"} onChange={handleChange("search_results")}>
						<ExpansionPanelSummary
							aria-controls="panel1a-content"
							id="panel1a-header">
							<AppBar className={classes.appBar} position="static">
							<Typography variant="h6" className={classes.title}>
							Search Results
							</Typography>
							</AppBar>
						</ExpansionPanelSummary>
						<SearchResults></SearchResults>
					</ExpansionPanel>
				</React.Fragment>
			);
		}
		else if (openTab === 2) {
			return (
				<React.Fragment>
					<Ladders></Ladders>
					<UnmatchedBets></UnmatchedBets>
					<MatchedBets></MatchedBets>
					<ProfitLoss></ProfitLoss>
					<Graph></Graph>
				</React.Fragment>
			);
		}
		else if (openTab === 3) {
			return (
				<React.Fragment>
					<Settings></Settings>
				</React.Fragment>
			);
		}
	}

	return (
		<div id="toggle-buttons">
			<button
				style={openTab === 1 ? { background: activeStyle } : {}}
				onClick={(e) => { setOpenTab(1) }}>Menu

			</button>
			<button
				style={openTab === 2 ? { background: activeStyle } : {}}
				onClick={(e) => { setOpenTab(2) }}>Market
			</button>
			<button
				style={openTab === 3 ? { background: activeStyle } : {}}
				onClick={(e) => { setOpenTab(3) }}>Settings
			</button>
			{renderActiveTab()}
		</div>
	);
}