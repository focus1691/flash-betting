import React, {Component} from 'react';
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

export default class ToggleMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {openTab: 2};
		this.activeStyle = { background: '#389C41' };
	}
	render() {
		return (
			<div id="toggle-buttons">
				<button
					style={this.state.openTab === 1 ? this.activeStyle : {}}
					onClick={this.onToggleButtonClick.bind(this, 1)}>Menu

				</button>
				<button
					style={this.state.openTab === 2 ? this.activeStyle : {}}
					onClick={this.onToggleButtonClick.bind(this, 2)}>Market
				</button>
				<button
					style={this.state.openTab === 3 ? this.activeStyle : {}}
					onClick={this.onToggleButtonClick.bind(this, 3)}>Settings
				</button>
				{this.renderActiveTab()}
			</div>
		);
	}
	renderActiveTab() {
		if (this.state.openTab === 1) {
        	return (
        		<React.Fragment>
        			<UserMarkets></UserMarkets>
        			<AllSports></AllSports>
        			<UserBets></UserBets>
        			<SearchResults></SearchResults>
        		</React.Fragment>
        	);
        }
        else if (this.state.openTab === 2) {
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
        else if (this.state.openTab === 3) {
        	return (
        		<React.Fragment>
        			<Settings></Settings>
        		</React.Fragment>
        	);
        }
	}
	onToggleButtonClick(tab) {
		this.setState(state => ({ openTab: tab }));
	}
}