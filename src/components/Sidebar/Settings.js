import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/settings';
import useStyles from '../Styles/Styles';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';

const Settings = props => {
	const classes = useStyles();

	// useEffect(() => {
	// 	fetch(`/api/get-user-settings`)
	// 	.then(res => res.json())
	// 	.then(settings => {
			
	// 		props.onReceiveTrainingBalance(settings.trainingBalance);
	// 		props.onToggleLadderColourContrast(settings.ladderColourContrast);
	// 		props.onToggleSounds(settings.sounds);
	// 		props.onToggleTools(settings.tools);
	// 		props.onToggleUnmatchedBets(settings.unmatchedBets);
	// 		props.onToggleMatchedBets(settings.matchedBets);
	// 		props.onToggleProfitAndLoss(settings.profitAndLoss);
	// 		props.onToggleProjectedSP(settings.projectedSP);
	// 		props.onToggleGraph(settings.graphs);
	// 		props.onToggleMarketInformation(settings.marketInfo);
	// 		props.onToggleRules(settings.rules);
	// 		// onToggleTrainingLadderAutoCenter(settings.trainingLadderAutoCenter);
	// 	});
	// });

	const saveSetting = setting => {
		fetch(`/api/save-user-settings`,
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({settings: setting})
		})
		.then(res => {})
	};

	const handleChange = () => {

	};

	return (
		<div>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Training Bank
				</Typography>
			</AppBar>
			<TextField
				id="standard-name"
				label="Bank Balance"
				margin="normal"
				onChange={val => props.onReceiveTrainingBalance(val)}
			/>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Ladder Colour
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.ladderColourContrast}
						onChange={val => props.onToggleLadderColourContrast(!props.ladderColourContrast)}
					/>
				}
				label="Ladder Colour Contrast"
			/>
			<button className={"save-btn"} onClick={e => saveSetting({ladderColourContrast: props.ladderColourContrast})}><img alt={"Save"} src={window.location.origin + '/icons/save.png'}/></button>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Sound
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.sounds}
						onChange={val => props.onToggleSounds(!props.sounds)}
					/>
				}
				label="Sounds"
			/>
			<button className={"save-btn"} onClick={e => saveSetting({sounds: props.sounds})}><img alt={"Save"} src={window.location.origin + '/icons/save.png'}/></button>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Tools
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.tools.visible}
						onChange={val => props.onToggleTools({ visible: !props.tools.visible, open: props.tools.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					tools: { visible: props.tools.visible, open: props.tools.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.tools.open}
						onChange={val => props.onToggleTools({ visible: props.tools.visible, open: !props.tools.open })}
					/>
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Unmatched Bets
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.unmatchedBets.visible}
						onChange={val => props.onToggleUnmatchedBets({ visible: !props.unmatchedBets.visible, open: props.unmatchedBets.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					unmatchedBets: { visible: props.unmatchedBets.visible, open: props.unmatchedBets.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.unmatchedBets.open}
						onChange={val => props.onToggleUnmatchedBets({ visible: props.unmatchedBets.visible, open: !props.unmatchedBets.open })}
					/>
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Matched Bets
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.matchedBets.visible}
						onChange={val => props.onToggleMatchedBets({ visible: !props.matchedBets.visible, open: props.matchedBets.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					matchedBets: { visible: props.matchedBets.visible, open: props.matchedBets.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.matchedBets.open}
						onChange={val => props.onToggleMatchedBets({ visible: props.matchedBets.visible, open: !props.matchedBets.open })}
					/>
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Profit & Loss
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.profitAndLoss.visible}
						onChange={val => props.onToggleProfitAndLoss({ visible: !props.profitAndLoss.visible, open: props.profitAndLoss.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					profitAndLoss: { visible: props.profitAndLoss.visible, open: props.profitAndLoss.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.profitAndLoss.open}
						onChange={val => props.onToggleProfitAndLoss({ visible: props.profitAndLoss.visible, open: !props.profitAndLoss.open })}
					/>
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Projected SP
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.projectedSP.visible}
						onChange={val => props.onToggleProjectedSP({ visible: !props.projectedSP.visible, open: props.projectedSP.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					projectedSP: { visible: props.projectedSP.visible, open: props.projectedSP.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.projectedSP.open}
						onChange={val => props.onToggleProjectedSP({ visible: props.projectedSP.visible, open: !props.projectedSP.open })}
					/>
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Graphs
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.graphs.visible}
						onChange={val => props.onToggleGraph({ visible: !props.graphs.visible, open: props.graphs.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					graphs: { visible: props.graphs.visible, open: props.graphs.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.graphs.open}
						onChange={val => props.onToggleGraph({ visible: props.graphs.visible, open: !props.graphs.open })}
					/>
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Market Information
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.marketInfo.visible}
						onChange={val => props.onToggleMarketInformation({ visible: !props.marketInfo.visible, open: props.marketInfo.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					marketInfo: { visible: props.marketInfo.visible, open: props.marketInfo.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.marketInfo.open}
						onChange={val => props.onToggleMarketInformation({ visible: props.marketInfo.visible, open: !props.marketInfo.open })}
					/>
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Rules
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.rules.visible}
						onChange={val => props.onToggleRules({ visible: !props.rules.visible, open: props.rules.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					rules: { visible: props.rules.visible, open: props.rules.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.rules.open}
						onChange={val => props.onToggleRules({ visible: props.rules.visible, open: !props.rules.open })}
					/>
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Training Ladder Auto-Center
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.trainingLadderAutoCenter}
						onChange={val => props.onToggleTrainingLadderAutoCenter(!props.trainingLadderAutoCenter)}
					/>
				}
				label="Default to ON"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					trainingLadderAutoCenter: props.trainingLadderAutoCenter
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Ladder Unmatched Column
				</Typography>
			</AppBar>
			<RadioGroup
				aria-label="gender"
				name="gender2"
				className={classes.group}
				value={34}
				onChange={handleChange}
			>
				<FormControlLabel
					value="female"
					control={<Radio color="primary" />}
					label="Unmatched Bets Only"
					labelPlacement="end"
				/>
				<FormControlLabel
					value="male"
					control={<Radio color="primary" />}
					label="Umatched Bets + P/L"
					labelPlacement="end"
				/>
				<FormControlLabel
					value="other"
					control={<Radio color="primary" />}
					label="Unmatched Bets + Hedge"
					labelPlacement="end"
				/>
			</RadioGroup>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		trainingBalance: state.settings.trainingBalance,
		ladderColourContrast: state.settings.ladderColourContrast,
		sounds: state.settings.sounds,
		tools: state.settings.tools,
		unmatchedBets: state.settings.unmatchedBets,
		matchedBets: state.settings.matchedBets,
		profitAndLoss: state.settings.profitAndLoss,
		projectedSP: state.settings.projectedSP,
		graphs: state.settings.graphs,
		marketInfo: state.settings.marketInfo,
		rules: state.settings.rules,
		trainingLadderAutoCenter: state.settings.trainingLadderAutoCenter,
		ladderUnmatched: state.settings.ladderUnmatched
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onReceiveTrainingBalance: balance => dispatch(actions.setTrainingBalance(balance)),
		onToggleLadderColourContrast: isSelected => dispatch(actions.toggleLadderColourContrast(isSelected)),
		onToggleSounds: isSelected => dispatch(actions.toggleSound(isSelected)),
		onToggleTools: settings => dispatch(actions.toggleTools(settings)),
		onToggleUnmatchedBets: settings => dispatch(actions.toggleUnmatchedBets(settings)),
		onToggleMatchedBets: settings => dispatch(actions.toggleMatchedBets(settings)),
		onToggleProfitAndLoss: settings => dispatch(actions.toggleProfitAndLoss(settings)),
		onToggleProjectedSP: settings => dispatch(actions.toggleProjectedSP(settings)),
		onToggleGraph: settings => dispatch(actions.toggleGraph(settings)),
		onToggleMarketInformation: settings => dispatch(actions.toggleMarketInformation(settings)),
		onToggleRules: settings => dispatch(actions.toggleRules(settings)),
		onToggleTrainingLadderAutoCenter: settings => dispatch(actions.toggleTrainingLadderAutoCenter(settings)),
		onToggleLadderUnmatched: isSelected => dispatch(actions.toggleLadderUnmatched(isSelected))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);