import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/settings";
import Menu from "./Menu/";
import Market from "./Market/";
import Settings from "./Settings/";
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

const ToggleMenu = () => {
  const [openTab, setOpenTab] = useState(2);
  const [activeStyle, setActiveStyle] = useState("#389C41");

  const classes = useStyles();

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
    switch (openTab) {
      case 1: return <Menu/>;
      case 2: return <Market/>
      case 3: return <Settings/>
      default: return null;
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

export default ToggleMenu;