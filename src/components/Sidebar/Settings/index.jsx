import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/settings';
import { makeStyles } from '@material-ui/core/styles';
import DefaultView from "./DefaultView";
import TrainingBank from "./TrainingBank";
import Sounds from "./Sounds";
import Tools from "./Tools";
import UnmatchedBets from "./UnmatchedBets";
import MatchedBets from "./MatchedBets";
import Graphs from "./Graphs";
import MarketInformation from './MarketInformation';
import WinMarkets from "./WinMarkets";
import Rules from "./Rules";
import LadderAutoCenter from "./LadderAutoCenter";
import LadderUnmatchedCol from "./LadderUnmatchedCol";
import StakeButtons from "./StakeButtons";
import LayButtons from "./LayButtons";
import RightClickTicks from "./RightClickTicks";
import HorseRacing from "./HorseRacing";

const useStyles = makeStyles(theme => ({
	appBar: {
		background: "#303030",
		color: "orange",
		fontWeight: "900",
		border: "2px solid #fff"
	},
	title: {
		textAlign: "center",
		fontWeight: "bold"
	},
	group: {
		margin: theme.spacing(1, 0)
	},
	textField: {
		width: 50,
		margin: theme.spacing(2),
	},
}));

const Settings = props => {
	const classes = useStyles();

	const saveSetting = setting => {
		fetch(`/api/save-user-settings`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(setting)
		});
	};

	return (
		<div>
			<DefaultView
				defaultView={props.defaultView}
				toggleDefaultView={props.onToggleDefaultView}
				saveSetting={saveSetting}
				premiumMember={props.premiumMember}
				classes={classes}
			/>

			<TrainingBank
				receiveTrainingBalance={balance => props.onReceiveTrainingBalance(balance)}
				styles={classes}
			/>

			<Sounds
				sounds={props.sounds}
				toggleSounds={props.onToggleSounds}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<Tools
				tools={props.tools}
				toggleTools={props.onToggleTools}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<UnmatchedBets
				unmatchedBets={props.unmatchedBets}
				toggleUnmatchedBets={props.onToggleUnmatchedBets}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<MatchedBets
				matchedBets={props.matchedBets}
				toggleMatchedBets={props.onToggleMatchedBets}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<Graphs
				graphs={props.graphs}
				toggleGraph={props.onToggleGraph}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<MarketInformation
				marketInfo={props.marketInfo}
				toggleMarketInformation={props.onToggleMarketInformation}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<WinMarkets
				winMarketsOnly={props.winMarketsOnly}
				updateWinMarketsOnly={props.onUpdateWinMarketsOnly}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<Rules
				rules={props.rules}
				toggleRules={props.onToggleRules}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<LadderAutoCenter
				trainingLadderAutoCenter={props.trainingLadderAutoCenter}
				toggleTrainingLadderAutoCenter={props.toggleTrainingLadderAutoCenter}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<LadderUnmatchedCol
				ladderUnmatched={props.ladderUnmatched}
				toggleLadderUnmatched={props.onToggleLadderUnmatched}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<StakeButtons
				stakeBtns={props.stakeBtns}
				updateStakeBtn={props.onUpdateStakeBtn}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<LayButtons
				layBtns={props.layBtns}
				updateLayBtn={props.onUpdateLayBtn}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<RightClickTicks
				rightClickTicks={props.rightClickTicks}
				updateRightClickTicks={props.onUpdateRightClickTicks}
				saveSetting={saveSetting}
				classes={classes}
			/>

			<HorseRacing
				horseRaces={props.horseRaces}
				toggleHorseRaces={props.onUpdateHorseRaces}
				saveSetting={saveSetting}
				classes={classes}
			/>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		premiumMember: state.settings.premiumMember,
		defaultView: state.settings.defaultView,
		view: state.settings.view,
		trainingBalance: state.settings.trainingBalance,
		sounds: state.settings.sounds,
		tools: state.settings.tools,
		unmatchedBets: state.settings.unmatchedBets,
		matchedBets: state.settings.matchedBets,
		graphs: state.settings.graphs,
		marketInfo: state.settings.marketInfo,
		winMarketsOnly: state.settings.winMarketsOnly,
		rules: state.settings.rules,
		trainingLadderAutoCenter: state.settings.trainingLadderAutoCenter,
		ladderUnmatched: state.settings.ladderUnmatched,
		stakeBtns: state.settings.stakeBtns,
		layBtns: state.settings.layBtns,
		rightClickTicks: state.settings.rightClickTicks,
		horseRaces: state.settings.horseRaces
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onToggleDefaultView: view => dispatch(actions.setDefaultView(view)),
		onReceiveTrainingBalance: balance => dispatch(actions.setTrainingBalance(balance)),
		onToggleSounds: isSelected => dispatch(actions.toggleSound(isSelected)),
		onToggleTools: settings => dispatch(actions.toggleTools(settings)),
		onToggleUnmatchedBets: settings => dispatch(actions.toggleUnmatchedBets(settings)),
		onToggleMatchedBets: settings => dispatch(actions.toggleMatchedBets(settings)),
		onToggleGraph: settings => dispatch(actions.toggleGraph(settings)),
		onToggleMarketInformation: settings => dispatch(actions.toggleMarketInformation(settings)),
		onUpdateWinMarketsOnly: isChecked => dispatch(actions.setWinMarketsOnly(isChecked)),
		onToggleRules: settings => dispatch(actions.toggleRules(settings)),
		onToggleTrainingLadderAutoCenter: settings => dispatch(actions.toggleTrainingLadderAutoCenter(settings)),
		onToggleLadderUnmatched: unmatchedColumn => dispatch(actions.toggleLadderUnmatched(unmatchedColumn)),
		onUpdateStakeBtn: data => dispatch(actions.updateStakeBtn(data)),
		onUpdateLayBtn: data => dispatch(actions.updateLayBtn(data)),
		onUpdateRightClickTicks: ticks => dispatch(actions.updateRightClickTicks(ticks)),
		onUpdateHorseRaces: horseRaces => dispatch(actions.setHorseRacingCountries(horseRaces))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);